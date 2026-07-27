-- PostgreSQL Production Schema for The Capsule
-- Source of Truth: Product & Technical Specification Section 9

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Capsules Table
CREATE TABLE capsules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    graduation_year INTEGER NOT NULL CHECK (graduation_year BETWEEN 2000 AND 2100),
    timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
    welcome_text TEXT,
    accent_theme VARCHAR(50) NOT NULL DEFAULT 'marigold',
    cover_media_id UUID,
    state VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (state IN ('draft', 'active', 'archived', 'deleted')),
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin Identities Table (Exactly 1 active admin per capsule)
CREATE TABLE admin_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    capsule_id UUID UNIQUE NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
    credential_provider VARCHAR(50) NOT NULL DEFAULT 'magic_link',
    credential_subject VARCHAR(255) NOT NULL,
    recovery_secret_hash VARCHAR(255) NOT NULL,
    last_authenticated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin Sessions Ledger Table
CREATE TABLE admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admin_identities(id) ON DELETE CASCADE,
    capsule_id UUID NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    last_reauthenticated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_hash VARCHAR(255) NOT NULL,
    user_agent_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Access Code Versions Table
CREATE TABLE access_code_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    capsule_id UUID NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
    verifier_hash VARCHAR(255) NOT NULL,
    generation INTEGER NOT NULL CHECK (generation >= 1),
    activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    rotation_reason VARCHAR(50) NOT NULL CHECK (rotation_reason IN ('manual', 'scheduled', 'security_revocation'))
);

-- Ensure only 1 active access code version per capsule
CREATE UNIQUE INDEX idx_active_access_code ON access_code_versions(capsule_id) WHERE revoked_at IS NULL;

-- Senior Ephemeral Sessions Table
CREATE TABLE senior_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    capsule_id UUID NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
    session_hash VARCHAR(255) UNIQUE NOT NULL,
    code_version_id UUID NOT NULL REFERENCES access_code_versions(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    ip_hash VARCHAR(255) NOT NULL,
    user_agent_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Anonymous Participant Handles Table
CREATE TABLE participant_handles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    capsule_id UUID NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
    session_id UUID REFERENCES senior_sessions(id) ON DELETE SET NULL,
    display_name_raw VARCHAR(255) NOT NULL,
    display_name_normalized VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Content Items Table
CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    capsule_id UUID NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
    author_handle_id UUID NOT NULL REFERENCES participant_handles(id) ON DELETE RESTRICT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('photo', 'video', 'memory', 'message')),
    title VARCHAR(255),
    body TEXT,
    caption TEXT,
    media_asset_id UUID,
    moment_at TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL DEFAULT 'visible' CHECK (status IN ('visible', 'hidden', 'deleted')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    hidden_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    status_reason VARCHAR(255)
);

CREATE INDEX idx_content_browse ON content_items(capsule_id, status, submitted_at DESC);

-- Media Assets Table
CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    capsule_id UUID NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
    content_item_id UUID REFERENCES content_items(id) ON DELETE SET NULL,
    kind VARCHAR(50) NOT NULL CHECK (kind IN ('image', 'video')),
    original_filename VARCHAR(255) NOT NULL,
    detected_mime VARCHAR(100) NOT NULL,
    bytes BIGINT NOT NULL CHECK (bytes > 0),
    sha256 VARCHAR(64),
    status VARCHAR(50) NOT NULL DEFAULT 'Requested' CHECK (status IN ('Requested', 'Uploading', 'Uploaded', 'Quarantined', 'Processing', 'Ready', 'Failed', 'Deleted', 'Purged')),
    storage_bucket VARCHAR(255),
    storage_key VARCHAR(512),
    width INTEGER,
    height INTEGER,
    duration_ms INTEGER,
    alt_text VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Media Variants Table
CREATE TABLE media_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    variant_type VARCHAR(50) NOT NULL CHECK (variant_type IN ('thumbnail', 'display', 'full', 'video_poster', 'hls_manifest', 'mp4_fallback')),
    storage_bucket VARCHAR(255) NOT NULL,
    storage_key VARCHAR(512) NOT NULL,
    mime VARCHAR(100) NOT NULL,
    bytes BIGINT NOT NULL CHECK (bytes > 0),
    width INTEGER,
    height INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'failed'))
);

-- Tags & Content Tags Join Tables
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    capsule_id UUID NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
    label_normalized VARCHAR(100) NOT NULL,
    label_display VARCHAR(100) NOT NULL,
    UNIQUE(capsule_id, label_normalized)
);

CREATE TABLE content_tags (
    content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (content_item_id, tag_id)
);

-- Audit Events Table (Append-Only)
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    capsule_id UUID NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
    actor_type VARCHAR(50) NOT NULL CHECK (actor_type IN ('senior', 'admin', 'system')),
    actor_id UUID,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(100) NOT NULL,
    target_id VARCHAR(255) NOT NULL,
    metadata_redacted JSONB DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_capsule ON audit_events(capsule_id, occurred_at DESC);

-- Deletion Purge SLA Queue Table
CREATE TABLE deletion_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('media_asset', 'media_variant', 'content_item')),
    target_id VARCHAR(255) NOT NULL,
    capsule_id UUID NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    execute_after TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    attempts INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ
);

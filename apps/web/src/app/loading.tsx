export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F4EE] text-[#1D1C1A]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#1D1C1A] border-t-[#D89B3C] animate-spin" />
        <p className="font-serif text-sm text-[#5D5A54] tracking-wide">Opening Capsule...</p>
      </div>
    </div>
  );
}

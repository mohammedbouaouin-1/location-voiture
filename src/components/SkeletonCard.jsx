export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Image placeholder with shimmer */}
      <div className="h-56 skeleton-shimmer"></div>
      
      {/* Content placeholder */}
      <div className="p-6">
        {/* Title */}
        <div className="h-6 skeleton-shimmer rounded-lg mb-2 w-3/4"></div>
        {/* Subtitle */}
        <div className="h-3 skeleton-shimmer rounded-lg mb-6 w-1/2"></div>
        
        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="h-14 skeleton-shimmer rounded-xl"></div>
          <div className="h-14 skeleton-shimmer rounded-xl"></div>
          <div className="h-14 skeleton-shimmer rounded-xl"></div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-5 flex justify-between items-center">
          <div>
            <div className="w-12 h-3 skeleton-shimmer rounded mb-2"></div>
            <div className="w-20 h-7 skeleton-shimmer rounded-lg"></div>
          </div>
          <div className="w-28 h-10 skeleton-shimmer rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

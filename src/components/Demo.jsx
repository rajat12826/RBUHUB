

import { useState, useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";


export default function Demo() {
  const [animationParent] = useAutoAnimate();
 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main ref={animationParent} className="p-10 space-y-3">
      { Array(5)
            .fill(0)
            .map((d, i) => <SkeletonCard key={i} />)
        }
    </main>
  );
}

function SkeletonCard() {
  return (
    <div className="border border-blue-300 shadow rounded-md p-4 max-w-full  w-full mx-auto">
      <div className=" animate-pulse  flex space-x-4">
      
        <div className="rounded-full bg-slate-700 h-10 w-10"></div>
        <div className="flex-1 space-y-6 py-1">
       
          <div className="h-2 bg-slate-700 rounded"></div>
        
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4">
              <div className="h-2 bg-slate-700 rounded col-span-2"></div>
              <div className="h-2 bg-slate-700 rounded col-span-1"></div>
              <div className="h-2 bg-slate-700 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-slate-700 rounded"></div>
            <div className="h-2 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}



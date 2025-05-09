import {useInView} from 'react-intersection-observer';
export default function LazyImageIntersection({src, alt, className,width,height,lazy}:{src:string,alt:string,className?:string,width?:number,height?:number,lazy:boolean}){
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
        rootMargin:'100px'
      });
    return <div ref={ref} className={className}>
        {inView ? <img
            loading={lazy?"lazy":'eager'}
            src={src}
            alt={alt}
            className={className}/> 
            :<div className={`bg-gray-600 animate-pulse ${className}`}/> 
}
    </div>
}
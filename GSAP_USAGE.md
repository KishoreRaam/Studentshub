# GSAP Animation Usage Guide

GSAP (GreenSock Animation Platform) v3.13.0 has been installed in this project for creating high-performance animations.

## Installation
GSAP is already installed. Version: 3.13.0

## Basic Usage Examples

### 1. Simple Animation
```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function MyComponent() {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(boxRef.current, {
      x: 100,
      duration: 1,
      ease: 'power2.out'
    });
  }, []);

  return <div ref={boxRef}>Animated Box</div>;
}
```

### 2. Scroll-Triggered Animation
```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ScrollComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(elementRef.current, {
      scrollTrigger: {
        trigger: elementRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 50,
      duration: 1
    });
  }, []);

  return <div ref={elementRef}>Scroll to reveal</div>;
}
```

### 3. Timeline Animation
```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function TimelineComponent() {
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);
  const box3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.to(box1Ref.current, { x: 100, duration: 1 })
      .to(box2Ref.current, { x: 100, duration: 1 }, '-=0.5')
      .to(box3Ref.current, { x: 100, duration: 1 }, '-=0.5');
  }, []);

  return (
    <>
      <div ref={box1Ref}>Box 1</div>
      <div ref={box2Ref}>Box 2</div>
      <div ref={box3Ref}>Box 3</div>
    </>
  );
}
```

### 4. Stagger Animation
```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function StaggerComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(containerRef.current?.children || [], {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });
  }, []);

  return (
    <div ref={containerRef}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </div>
  );
}
```

### 5. Hover Animation with React
```tsx
import { useRef } from 'react';
import gsap from 'gsap';

function HoverComponent() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    gsap.to(buttonRef.current, {
      scale: 1.1,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  return (
    <button
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      Hover me
    </button>
  );
}
```

## Common GSAP Properties

- **x, y, z**: Translation in pixels
- **rotation, rotationX, rotationY**: Rotation in degrees
- **scale, scaleX, scaleY**: Scale factor
- **opacity**: Opacity (0 to 1)
- **duration**: Animation duration in seconds
- **delay**: Delay before animation starts
- **ease**: Easing function (power1, power2, power3, power4, elastic, bounce, etc.)
- **stagger**: Delay between animating multiple elements

## GSAP Plugins Available

### ScrollTrigger
For scroll-based animations:
```tsx
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

### ScrollToPlugin
For smooth scrolling:
```tsx
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);
```

### TextPlugin
For text animations:
```tsx
import { TextPlugin } from 'gsap/TextPlugin';
gsap.registerPlugin(TextPlugin);
```

## Best Practices

1. **Always use refs**: Store references to DOM elements you want to animate
2. **Cleanup**: Clean up animations in useEffect return function
3. **Use timelines**: For complex sequences of animations
4. **Register plugins once**: Register GSAP plugins at the top of your file
5. **Performance**: Use transforms (x, y, scale, rotation) for best performance

## Example Cleanup Pattern
```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // Your animations here
    gsap.to('.box', { x: 100 });
  });

  return () => ctx.revert(); // Cleanup on unmount
}, []);
```

## Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [GSAP Cheat Sheet](https://greensock.com/cheatsheet/)
- [GSAP Ease Visualizer](https://greensock.com/ease-visualizer/)
- [GSAP Forum](https://greensock.com/forums/)

## Current Project Usage

GSAP can be used alongside or as a replacement for Framer Motion animations throughout the project. Consider using GSAP for:
- Complex timeline animations
- High-performance scroll animations
- Precise control over animation sequences
- SVG animations
- Advanced easing requirements

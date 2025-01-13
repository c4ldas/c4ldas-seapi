import Link from 'next/link';
import React from 'react'

export default function Linkbox(props) {
  return (
    <div
      className="link-box"
      style={{
        backgroundImage: props.image ? `url(${props.image})` : "",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      {/* Overlay for transparency */}
      <div
        style={{
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: props.image ? 'rgba(255, 255, 255, 0.6)' : 'transparent',
          zIndex: 1
        }}
      ></div>

      {/* Content above the overlay */}
      {props.a ? (
        <a
          href={props.link}
          onClick={props.onClick}
          className="link-content"
          style={{ position: 'relative', zIndex: 2 }}
          {...props}
        >
          <h3 style={{ color: 'black' }}>{props.title}</h3>
          <p className="description">{props.description}<span className={props.spanClass}>{props.span}</span></p>
        </a>)
        : (
          <Link href={props.link} className="link-content" style={{ position: 'relative', zIndex: 2 }}>
            <h3 style={{ color: 'black' }}>{props.title}</h3>
            <p className="description">{props.description}<span className={props.spanClass}>{props.span}</span></p>
          </Link>
        )}
    </div>
  );
}

/* 
// Old version
export default function Linkbox(props) {
  return (
    <div className="link-box">
      <Link href={props.link} className="link-content" >
        <h3>{props.title}</h3>
        <p className="description">{props.description}<span className={props.spanClass}>{props.span}</span></p>
      </Link>
    </div>
  )
}
*/
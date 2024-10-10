import Link from 'next/link';
import React from 'react'

export default function Linkbox(props) {
  return (
    <div className="link-box">
      <Link href={props.link} className="link-content">
        <h3>{props.title}</h3>
        <p className="description">{props.description}<span className={props.spanClass}>{props.span}</span></p>
      </Link>
    </div>
  )
}

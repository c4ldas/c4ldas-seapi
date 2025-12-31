"use client"

export default function LoggedUser(props, asdf) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10%" }}>
      <div>
        <p><strong>Channel name:</strong> {props.username} </p>
        <p><strong>Channel ID:</strong> {props.id}</p>
        <p><strong>Platform:</strong> {props.provider}</p>
      </div>
      <img src={props.avatar} alt="avatar" style={{ borderRadius: "50%", width: "100px", height: "100px" }} />
    </div>
  )
}

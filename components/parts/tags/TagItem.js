export default function TagItem({ val, rm }) {
  return (
    <>
      {val.map((v, key) => (
        <div key={key} className="tagsBlock">
          <div className="blockLabel">{v}</div>
          <svg className="blockIcon" onClick={e => rm(e, key)}>
            <use xlinkHref="/img/icomoon/sprite.svg#icon-cross"></use>
          </svg>
        </div>
      ))}
    </>
  );
}

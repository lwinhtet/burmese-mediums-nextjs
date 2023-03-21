export const svgIcon = (iconName = '', style = '') => {
  // return <use xlinkHref={`/img/icomoon/sprite.svg#${iconName}`}></use>;
  return (
    <svg className={style}>
      <use xlinkHref={`/img/icomoon/sprite.svg#${iconName}`}></use>
    </svg>
  );
};

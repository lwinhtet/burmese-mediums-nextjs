import styles from '../pages/portfolios/portfolios.module.scss';

export default function FilterPortfolios() {
  return (
    <form>
      <div className="form-control">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          className="myInput"
          autoComplete="off"
          autoCorrect="off"
          required
        />
      </div>
      <div className="form-control">
        <label htmlFor="profession">Profession</label>
        <input
          type="text"
          name="profession"
          className="myInput"
          autoComplete="off"
          autoCorrect="off"
          required
        />
      </div>
      <div className="form-control">
        <label htmlFor="industry">Mediums</label>
        <input
          type="text"
          name="mediums"
          className="myInput"
          autoComplete="off"
          autoCorrect="off"
          required
        />
      </div>
      <div className="form-control">
        <label htmlFor="topic">Topic</label>
        <input
          type="text"
          name="topic"
          className="myInput"
          autoComplete="off"
          autoCorrect="off"
          required
        />
      </div>
      <div className="form-control">
        <label htmlFor="softwares">Softwares</label>
        <input
          type="text"
          name="softwares"
          className="myInput"
          autoComplete="off"
          autoCorrect="off"
          required
        />
      </div>
      <div className="form-control">
        <label htmlFor="city">City</label>
        <input
          type="text"
          name="city"
          className="myInput"
          autoComplete="off"
          autoCorrect="off"
          required
        />
      </div>
      <button className={`${styles.filterBtn} btn btn-green`}>Filter</button>
    </form>
  );
}

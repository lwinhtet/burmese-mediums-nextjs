export default function ComboBox() {
  return (
    <div>
      <label htmlFor="ex1-input" id="ex1-label" className="combobox-label">
        Fruits and vegetables
      </label>
      <div className="combobox-wrapper">
        <div id="ex1-combobox">
          <input
            type="text"
            role="combobox"
            autoComplete="off"
            aria-haspopup="grid"
            aria-expanded="false"
            aria-autocomplete="list"
            aria-controls="ex1-grid"
            id="ex1-input"
          />
        </div>
        <div
          aria-labelledby="ex1-label"
          role="grid"
          id="ex1-grid"
          className="grid hidden"
        ></div>
      </div>
    </div>
  );
}

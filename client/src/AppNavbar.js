const AppNavbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Sensor de Pulsos
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-bs-toggle="offcanvas"
                  aria-current="page"
                  href="#offcanvasExample"
                  role="button"
                  aria-controls="offcanvasExample"
                >
                  Historial
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div>
        <div
          className="offcanvas offcanvas-start"
          tabindex="-1"
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasExampleLabel">
              Historial
            </h5>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            {localStorage.getItem("history") &&
              JSON.parse(localStorage.getItem("history")).map(
                (result, index) => (
                  <div className="card mt-2 small">
                    <div className="card-header">
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">{result.person}</span>
                        <span>{result.timestamp}</span>
                      </div>
                    </div>
                    <div className="p-2">
                      <ul>
                        <li>Mínimo: {result.minimum} bpm</li>
                        <li>Máximo: {result.maximum} bpm</li>
                        <li>Promedio: {result.average} bpm</li>
                      </ul>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AppNavbar;

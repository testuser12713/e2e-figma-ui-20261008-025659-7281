import { Link } from 'react-router-dom';

export function NotFoundScreen() {
  return (
    <section className="notFound" aria-labelledby="not-found-title">
      <p className="notFoundCode">404</p>
      <h1 id="not-found-title" className="notFoundTitle">
        Diese Seite wurde nicht gefunden.
      </h1>
      <p className="notFoundBody">
        Die aufgerufene Adresse existiert nicht oder wurde verschoben.
      </p>
      <Link className="notFoundAction" to="/">
        Zum Dashboard
      </Link>
    </section>
  );
}

export default NotFoundScreen;

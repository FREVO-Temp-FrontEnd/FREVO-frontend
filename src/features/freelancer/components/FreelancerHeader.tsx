import { Link } from "react-router";
import { NotificationsBell } from "./NotificationsBell";

export function FreelancerHeader() {
  return (
    <header className="site-header freelancer-header flex items-center justify-between">
      <div className="header-left flex items-center">
        <Link to="/" aria-label="FREVO - Khám phá dự án">
          <img className="logo" src="/assets/frevo-logo.png" width={112} height={45} alt="FREVO" />
        </Link>
        <span className="header-divider" aria-hidden="true" />
        <span className="screen-name">Khám phá dự án</span>
      </div>
      <div className="header-actions">
        <NotificationsBell />
        <Link to="/profile" className="account flex items-center" aria-label="Tài khoản của Minh Anh">
          <span className="account-copy">
            <strong>Minh Anh</strong>
            <small>Freelancer</small>
          </span>
          <span className="avatar grid place-items-center" aria-hidden="true">MA</span>
        </Link>
      </div>
    </header>
  );
}

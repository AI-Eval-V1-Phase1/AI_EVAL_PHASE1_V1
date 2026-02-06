import { CheckCircle } from "lucide-react";
import CardContainerOnBoarding from "./CardContainerOnBoarding";
import { Link } from "react-router-dom";
// css is in card.css

interface CardConfirmationProps {
  /** Link text shown to the user */
  pageNavigateLink?: string;
  /** Route path to navigate to when the link is clicked (e.g. /vendorSelfAttestation/:token). If omitted, uses "/" */
  navigateTo?: string;
}
const CardConfirmation = ({ pageNavigateLink, navigateTo }: CardConfirmationProps) => {
  const linkTo = (navigateTo && navigateTo.trim() !== "") ? navigateTo : "/";
  const linkText = pageNavigateLink ?? "Continue";

  return (
    <>
      <CardContainerOnBoarding>
        <div className="onboarding_setup_card">
          <CheckCircle className="confirm_onboarding" />
          <h2>You're all set!</h2>
          <p>
            Your profile has been configured. This information will be used to
            pre-fill assessment fields and personalize your experience on the
            platform.
          </p>
          <Link to={linkTo}>{linkText}</Link>
        </div>
      </CardContainerOnBoarding>
    </>
  );
};

export default CardConfirmation;

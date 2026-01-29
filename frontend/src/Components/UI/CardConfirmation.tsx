import { CheckCircle } from "lucide-react"
import CardContainerOnBoarding from "./CardContainerOnBoarding"
import { Link } from "react-router-dom"
// css is in card.css

const CardConfirmation = ({pageNavigateLink}) => {
  return (
   <>
   <CardContainerOnBoarding>
    <div className="onboarding_setup_card">
        <CheckCircle className="confirm_onboarding" />
        <h2>You're all set!</h2>
        <p>Your profile has been configured. This information will be used to pre-fill assessment fields and personalize your experience on the platform.</p>
        <Link to="/">{pageNavigateLink}</Link>
    </div>
       
      </CardContainerOnBoarding>
   </>
  )
}

export default CardConfirmation
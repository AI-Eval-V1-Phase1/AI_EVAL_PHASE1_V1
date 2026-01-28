// import { Building2 } from 'lucide-react'

import { Store } from "lucide-react";

type HeaderProps = {
    title_vendor : string;
    sub_title_vendor?: string;
}

const HeaderForVendor = ({title_vendor, sub_title_vendor}: HeaderProps) => {
  return (
     <div className="step_form_header">
        <h2>{title_vendor}</h2>
        <p className='subtitle_header'>{sub_title_vendor}</p>
        {/* <p className='selected_role'><span><Building2 size={16}/></span>Vendor</p> */}
        <p className='selected_role'><span><Store size={16}/></span>Vendor</p>
      </div>
  )
}

export default HeaderForVendor
// import { Building2 } from 'lucide-react'

import { Building2, Store } from "lucide-react";

type HeaderProps = {
  title_vendor: string;
  sub_title_vendor?: string;
  className?: string;
};

const HeaderForBuyer = ({
  title_vendor,
  sub_title_vendor,
  className,
}: HeaderProps) => {
  return (
    <div className={className}>
        <p className='selected_role_vendor'><span><Building2 size={16}/></span>Buyer</p>
        <h2>{title_vendor}</h2>
        <p className='sub_title_card'>{sub_title_vendor}</p>
        {/* <p className='selected_role'><span><Building2 size={16}/></span>Vendor</p> */}
      </div>
  );
};

export default HeaderForBuyer;

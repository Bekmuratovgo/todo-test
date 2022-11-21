import React, { FC, ReactElement } from 'react'
import './Loader.less';

const Loader: FC = (): ReactElement => {
    return (
        <div className="lds-dual-ring"></div>
    )
}
export default Loader;
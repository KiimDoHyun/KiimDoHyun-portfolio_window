import { useState } from "react"
import Main from "../Component/Main"
import img from '../logo.svg'

const MainContainer = () => {
    const [iconBoxArr] = useState([
        {
            key: 0,
            img: img,
            name: 'Battle.net'
        }
    ])

    const propDatas = {
        iconBoxArr
    }
    return <Main {...propDatas}/>
}

export default MainContainer;
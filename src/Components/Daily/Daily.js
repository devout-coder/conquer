import React from 'react'
import firebaseApp from '../../firebase'
import Navbar from '../Navbar/Navbar'
import './Daily.css'
import notesIcon from '../../images/notesIcon.svg'
import dailyIcon from '../../images/dailyIcon.svg'
import weekIcon from '../../images/weekIcon.svg'
import monthIcon from '../../images/monthIcon.svg'
import yearIcon from '../../images/yearIcon.svg'
import longTermIcon from '../../images/longTermIcon.svg'
import visionBoardIcon from '../../images/visionBoardIcon.svg'
import Sidebar from '../Sidebar/Sidebar'

function Daily() {
    return (
        <div className="daily" >
            <Navbar/>
            <Sidebar/>
        </div>
    )
}

export default Daily
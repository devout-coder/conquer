import React from 'react'
import firebaseApp from '../../firebase'
import './Daily.css'

function Daily() {
    return (
        <div className="daily" >
            Hello { firebaseApp.auth().currentUser && firebaseApp.auth().currentUser.displayName}
        </div>
    )
}

export default Daily
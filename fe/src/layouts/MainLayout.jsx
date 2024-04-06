import React from 'react'
import NavigationBar from '../components/navigationBar/NavigationBar'
import Footer from '../components/footer/Footer'

const MainLayout = ({ children }) => {
    return (
        <>
            <NavigationBar />
            {children}
            <Footer />
        </>
    )
}

export default MainLayout

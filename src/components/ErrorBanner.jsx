import '../styles/type.css'


function ErrorBanner({error}) {

    if (!error) {
        return <div/>
    }

    return (
        <div className="center">
            <h4 style={{color:'red'}}>{error}</h4>
        </div>
    )
}

export default ErrorBanner;
const AboutBox = () => {
    return (
        <div className="content-container">
            <div className="content-box about-me">
                <h2>About Me</h2>
                <hr/>
                <p>My name is Crina Gurev and I created this website to help everyone with their studies.
                    I am looking to expend the site's capabilities and add more features. </p>
                <br/>
                <h6>To contact me write an email at:</h6>
                <a href="mailto:crinagurev@gmail.com">crinagurev@gmail.com</a>
            </div>
            <div className="content-box my-study-helper">
                <h2>Welcome to MyStudyHelper!</h2>
                <hr/>
                <p>This website was built using SpringBoot, React and PostgreSQL. It authenticates the user with JWT,
                    allowing to securely transmit requests to private resources. For increased security, the React App
                    makes use of private routes. </p>
                <div className="logo-image">
                    <div className="react-logo-container">
                        <img src={`${process.env.PUBLIC_URL}/logo512.png`} alt="React Logo"/>
                    </div>
                    <div className="spring-logo-container">
                        <img src={`${process.env.PUBLIC_URL}/spring.png`} alt="SpringBoot Logo"/>
                    </div>
                    <div className="sql-logo-container">
                        <img src={`${process.env.PUBLIC_URL}/sql.png`} alt="PostgreSQL Logo"/>
                    </div>
                </div>
            </div>

        </div>


    );
};

export default AboutBox;

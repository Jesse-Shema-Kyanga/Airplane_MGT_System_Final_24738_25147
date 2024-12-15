import { NavLink } from 'react-router-dom';
import React from 'react'
import "../pages/homeStyles.css"

const Home = () => {
  return (
    <div>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
            <a className="navbar-brand" href="#">SkyWings Airlines</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="navbar-nav ms-auto">
                            <li className="nav-item"><NavLink className="nav-link" to="/home">Home</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link active" to="/passenger-flights">Flights</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/my-tickets">My Tickets</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/">Logout</NavLink></li>
    </ul>
</div>
        </div>
    </nav>

    
    <header className="hero">
        <div className="container h-100">
            <div className="row h-100 align-items-center">
                <div className="col-12">
                    <h1 className="text-white">Explore the World with Us</h1>
                    <p className="text-white">Find the best deals on flights to your dream destinations</p>
                </div>
            </div>
        </div>
    </header>



<section className="about-us py-5 bg-light">
    <div className="container">
        <div className="row align-items-center">
            <div className="col-md-6">
                <h2 className="mb-4">About SkyWings Airlines</h2>
                <p className="lead">Leading the way in aviation excellence since 1990</p>
                <p>At SkyWings Airlines, we're dedicated to connecting the world through safe, comfortable, and memorable journeys. With over 30 years of experience, we've built a reputation for excellence in aviation.</p>
                <div className="row mt-4">
                    <div className="col-6">
                        <div className="achievement text-center">
                            <i className="bi bi-airplane fs-1 text-primary"></i>
                            <h3>200+</h3>
                            <p>Aircraft Fleet</p>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="achievement text-center">
                            <i className="bi bi-globe fs-1 text-primary"></i>
                            <h3>150+</h3>
                            <p>Destinations</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <img src="https://www.forbesindia.com/media/images/2019/Apr/img_115471_corporatetravel_bg.jpg" alt="About Us" className="img-fluid rounded shadow"/>
            </div>
        </div>
    </div>
</section>


<section className="services py-5">
    <div className="container">
        <h2 className="text-center mb-5">Our Premium Services</h2>
        <div className="row g-4">
            <div className="col-md-4">
                <div className="service-card text-center p-4">
                    <i className="bi bi-star fs-1 text-primary mb-3"></i>
                    <h4>First Class Experience</h4>
                    <p>Luxurious seats, gourmet dining, and personalized service for an unforgettable journey.</p>
                </div>
            </div>
            <div className="col-md-4">
                <div className="service-card text-center p-4">
                    <i className="bi bi-briefcase fs-1 text-primary mb-3"></i>
                    <h4>Business Travel</h4>
                    <p>Dedicated lounges, priority boarding, and flexible booking options for business travelers.</p>
                </div>
            </div>
            <div className="col-md-4">
                <div className="service-card text-center p-4">
                    <i className="bi bi-house-door fs-1 text-primary mb-3"></i>
                    <h4>Vacation Packages</h4>
                    <p>All-inclusive holiday packages with flights, hotels, and activities at amazing prices.</p>
                </div>
            </div>
            <div className="col-md-4">
                <div className="service-card text-center p-4">
                    <i className="bi bi-currency-exchange fs-1 text-primary mb-3"></i>
                    <h4>Miles Program</h4>
                    <p>Earn and redeem miles for flights, upgrades, and exclusive rewards.</p>
                </div>
            </div>
            <div className="col-md-4">
                <div className="service-card text-center p-4">
                    <i className="bi bi-shield-check fs-1 text-primary mb-3"></i>
                    <h4>Travel Insurance</h4>
                    <p>Comprehensive travel protection for peace of mind during your journey.</p>
                </div>
            </div>
            <div className="col-md-4">
                <div className="service-card text-center p-4">
                    <i className="bi bi-headset fs-1 text-primary mb-3"></i>
                    <h4>24/7 Support</h4>
                    <p>Round-the-clock customer service to assist you anywhere, anytime.</p>
                </div>
            </div>
        </div>
    </div>
</section>




    
<section className="destinations py-5"> <div className="container"> <h2 className="text-center mb-4">Popular Destinations</h2> <div className="row"> <div className="col-md-4 mb-4"> <div className="card"> <img src="https://i.pinimg.com/736x/2b/eb/1d/2beb1d8face8c1ef5ed03047c1de3b02.jpg" alt="Destination" /> <div className="card-body"> <h5 className="card-title">Paris, France</h5> <p className="card-text">Starting from $499</p> <NavLink to="/passenger-flights" className="btn btn-outline-primary">Book Now</NavLink> </div> </div> </div> <div className="col-md-4 mb-4"> <div className="card"> <img src="https://a.cdn-hotels.com/gdcs/production172/d1381/8efd3f69-63bb-4398-a595-095cea25fc37.jpg" className="card-img-top" alt="Destination" /> <div className="card-body"> <h5 className="card-title">Tokyo, Japan</h5> <p className="card-text">Starting from $799</p> <NavLink to="/passenger-flights" className="btn btn-outline-primary">Book Now</NavLink> </div> </div> </div> <div className="col-md-4 mb-4"> <div className="card"> <img src="https://www.planetware.com/photos-large/USNY/new-york-city-statue-of-liberty.jpg" className="card-img-top" alt="Destination" /> <div className="card-body"> <h5 className="card-title">New York, USA</h5> <p className="card-text">Starting from $399</p> <NavLink to="/passenger-flights" className="btn btn-outline-primary">Book Now</NavLink> </div> </div> </div> </div> </div> </section>

    
    <footer className="bg-dark text-white py-4">
        <div className="container">
            <div className="row">
                <div className="col-md-4">
                    <h5>About SkyWings</h5>
                    <p>Your trusted partner for air travel since 1990.</p>
                </div>
                <div className="col-md-4">
                    <h5>Quick Links</h5>
                    <ul className="list-unstyled">
                        <li><a href="#" className="text-white">Flight Status</a></li>
                        <li><a href="#" className="text-white">Travel Info</a></li>
                        <li><a href="#" className="text-white">Baggage</a></li>
                    </ul>
                </div>
                <div className="col-md-4">
                    <h5>Contact Us</h5>
                    <p>Email: info@skywings.com<br/>
                    Phone: 1-800-SKY-WING</p>
                </div>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>

    </div>
  )
}

export default Home
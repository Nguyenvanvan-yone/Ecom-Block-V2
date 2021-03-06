import React,{ useEffect,useState} from "react";
import OwlCarousel from 'react-owl-carousel';
import Notiflix from 'notiflix';
import { Link } from "react-router-dom";
import productApi from "../../Api/productApi";

const LastestSlideProduct = () => {
    const [latestProducts,setLatestProducts] = useState();
    const [topRateProducts,setTopRateProducts] = useState();
    useEffect(() => {
        const params = {
            type: 'latest'
        }
        productApi.getAll(params)
        .then((res)=>{
            if(res.success === true){
                setLatestProducts(res.products);
            }
        })
        .catch((error)=>{ 
            Notiflix.Notify.failure("Product not found please come back later!");
        })
    }, []);
    useEffect(() => {
        const params = {
            type: 'top-rated'
        }
        productApi.getAll(params)
        .then((res)=>{
            if(res.success === true){
                setTopRateProducts(res.products);
            }
        })
        .catch((error)=>{ 
            Notiflix.Notify.failure("Product not found please come back later!");
        })
    }, []);
    return (
        <section className="latest-product spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-6"> 
                        <div className="latest-product__text">
                            <h4>Latest Products</h4>
                            {
                            latestProducts 
                            && <OwlCarousel className="latest-product__slider owl-carousel"
                                loop 
                                margin={10} 
                                nav
                                items="1"
                                autoplay
                                animateOut={"fadeOut"}
                                smartSpeed= "1200"    
                                >
                                    <div className="latest-prdouct__slider__item">
                                        {
                                            latestProducts.listOne.map((product)=>{
                                                let price = product.price;
                                                return ( <Link key={product._id} to={`product/${product._id}`} className="latest-product__item">
                                                            <div className="latest-product__item__pic">
                                                                <img src={`https://ecom-block.herokuapp.com/uploads/${product.image}`} alt="" />
                                                            </div>
                                                            <div className="latest-product__item__text">
                                                                <h6>{product.name}</h6>
                                                                <span>{price.toLocaleString('vi-VN', {style: 'currency',currency: 'VND'})}</span>
                                                            </div>
                                                        </Link>)
                                            })
                                        }
                                    </div>
                                    <div className="latest-prdouct__slider__item">
                                    {
                                        latestProducts.listTwo.map((product)=>{
                                            let price = product.price;
                                            return ( <Link key={product._id} to={`product/${product._id}`} className="latest-product__item">
                                                        <div className="latest-product__item__pic">
                                                            <img src={`https://ecom-block.herokuapp.com/uploads/${product.image}`} alt="" />
                                                        </div>
                                                        <div className="latest-product__item__text">
                                                            <h6>{product.name}</h6>
                                                            <span>{price.toLocaleString('vi-VN', {style: 'currency',currency: 'VND'})}</span>
                                                        </div>
                                                    </Link>)
                                        })
                                    }
                                    </div>
                                </OwlCarousel>
                            }
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                    <div className="latest-product__text">
                        <h4>Top Rated Products</h4>
                        {
                            topRateProducts &&  <OwlCarousel className="latest-product__slider owl-carousel"
                                            loop 
                                            margin={10} 
                                            nav
                                            items="1"
                                            autoplay
                                            animateOut={"fadeOut"}
                                            smartSpeed= "1200"
                                        >
                                        <div className="latest-prdouct__slider__item">
                                        {
                                            topRateProducts.listOne.map((product)=>{
                                                let price = product.price;
                                                return ( <Link key={product._id} to={`product/${product._id}`} className="latest-product__item">
                                                            <div className="latest-product__item__pic">
                                                                <img src={`https://ecom-block.herokuapp.com/uploads/${product.image}`} alt="" />
                                                            </div>
                                                            <div className="latest-product__item__text">
                                                                <h6>{product.name}</h6>
                                                                <span>{price.toLocaleString('vi-VN', {style: 'currency',currency: 'VND'})}</span>
                                                            </div>
                                                        </Link>)
                                            })
                                        }
                                        </div>
                                        <div className="latest-prdouct__slider__item">
                                        {
                                            topRateProducts.listTwo.map((product)=>{
                                                let price = product.price;
                                                return ( <a key={product._id} to={`product/${product._id}`} className="latest-product__item">
                                                            <div className="latest-product__item__pic">
                                                                <img src={`https://ecom-block.herokuapp.com/uploads/${product.image}`} alt="" />
                                                            </div>
                                                            <div className="latest-product__item__text">
                                                                <h6>{product.name}</h6>
                                                                <span>{price.toLocaleString('vi-VN', {style: 'currency',currency: 'VND'})}</span>
                                                            </div>
                                                        </a>)
                                            })
                                        }
                                        </div>
                                    </OwlCarousel>
                        }
                    </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                    <div className="latest-product__text">
                        <h4>Review Products</h4>
                        <OwlCarousel className="latest-product__slider owl-carousel"
                            loop 
                            margin={10} 
                            nav
                            items="1"
                            autoplay
                            animateOut={"fadeOut"}
                            smartSpeed= "1200"

                        >
                            <div className="latest-prdouct__slider__item">
                                <a href="#" className="latest-product__item">
                                <div className="latest-product__item__pic">
                                    <img src="img/latest-product/lp-1.jpg" alt="" />
                                </div>
                                <div className="latest-product__item__text">
                                    <h6>Crab Pool Security</h6>
                                    <span>$30.00</span>
                                </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                <div className="latest-product__item__pic">
                                    <img src="img/latest-product/lp-2.jpg" alt="" />
                                </div>
                                <div className="latest-product__item__text">
                                    <h6>Crab Pool Security</h6>
                                    <span>$30.00</span>
                                </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                <div className="latest-product__item__pic">
                                    <img src="img/latest-product/lp-3.jpg" alt="" />
                                </div>
                                <div className="latest-product__item__text">
                                    <h6>Crab Pool Security</h6>
                                    <span>$30.00</span>
                                </div>
                                </a>
                            </div>
                            <div className="latest-prdouct__slider__item">
                                <a href="#" className="latest-product__item">
                                <div className="latest-product__item__pic">
                                    <img src="img/latest-product/lp-1.jpg" alt="" />
                                </div>
                                <div className="latest-product__item__text">
                                    <h6>Crab Pool Security</h6>
                                    <span>$30.00</span>
                                </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                <div className="latest-product__item__pic">
                                    <img src="img/latest-product/lp-2.jpg" alt="" />
                                </div>
                                <div className="latest-product__item__text">
                                    <h6>Crab Pool Security</h6>
                                    <span>$30.00</span>
                                </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                <div className="latest-product__item__pic">
                                    <img src="img/latest-product/lp-3.jpg" alt="" />
                                </div>
                                <div className="latest-product__item__text">
                                    <h6>Crab Pool Security</h6>
                                    <span>$30.00</span>
                                </div>
                                </a>
                            </div>
                        </OwlCarousel>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LastestSlideProduct
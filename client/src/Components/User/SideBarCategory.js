import React,{useState, useEffect, useReducer} from "react";
import {Link} from "react-router-dom";
import $ from "jquery";
import Notiflix from 'notiflix';
import categoryApi from "../../Api/categoryApi";
import CategoryReducer,{ initCategory } from "../../Reducer/CategoryReducer";
const SideBarCategory = () =>{
    useEffect(() => {
        $('.hero__categories__all').on('click', function(){
            $('.hero__categories ul').slideToggle(400);
        });
        
    }, []);
    const [state, dispatch] = useReducer(CategoryReducer, initCategory);
    const {categories, isLoading} = state;
    if(isLoading) {
        Notiflix.Loading.hourglass("Loading data...",{
            clickToClose: true,
            svgSize: '120px',
        });
    } else {
        Notiflix.Loading.remove(500);
    }
    useEffect(()=>{
        dispatch({ type: "FETCH_INIT" });
        categoryApi.getAll()
        .then((res)=>{
            if(res.success === true){
                dispatch({ type: "FETCH_SUCCESS", payload: res.category })
            }
        })
        .catch((error)=>{
            dispatch({ type: "FETCH_FAILURE" });
            Notiflix.Report.failure("Category not Found","please come back later" , 'Cancel');
        })
    },[])
    return (
        <section className="hero">
            <div className="container">
            <div className="row">
                <div className="col-lg-3">
                <div className="hero__categories" style={{position: 'relative'}}>
                    <div className="hero__categories__all">
                    <i className="fa fa-bars" />
                    <span>All departments</span>
                    </div>
                    <ul>
                        {categories.map((category,index)=>{
                            return (
                                <li key={index}><Link to="">{category.name}</Link></li>
                            )
                        })}
                    </ul>
                </div>
                </div>
                <div className="col-lg-9">
                    <div className="hero__search">
                        <div className="hero__search__form">
                        <form action="#">
                            <div className="hero__search__categories">
                            All Categories
                            <span className="arrow_carrot-down" />
                            </div>
                            <input type="text" placeholder="What do yo u need?" />
                            <button type="submit" className="site-btn">SEARCH</button>
                        </form>
                        </div>
                        <div className="hero__search__phone">
                        <div className="hero__search__phone__icon">
                            <i className="fa fa-phone" />
                        </div>
                        <div className="hero__search__phone__text">
                            <h5>+65 11.188.888</h5>
                            <span>support 24/7 time</span>
                        </div>
                        </div>
                    </div>
                    <div className="hero__item set-bg" data-setbg={`/Resource/User/image/hero/banner.jpg`}>
                        <div className="hero__text">
                        <span>FRUIT FRESH</span>
                        <h2>Vegetable <br />100% Organic</h2>
                        <p>Free Pickup and Delivery Available</p>
                        <Link to="" className="primary-btn">SHOP NOW</Link>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </section>
    )
}

export default SideBarCategory;
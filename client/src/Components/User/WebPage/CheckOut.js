import React,{useEffect,useState} from 'react'
import { Link } from 'react-router-dom';
import Notiflix from 'notiflix';
import checkoutApi from '../../../Api/checkoutApi';
import authorizationApi from '../../../Api/authApi';
import {useWeb3, useMetaMark} from '../../../Providers';
function CheckOut({cartItems,setCartItems}) {
    const subTotal = cartItems.reduce((total,item)=>total+ item.price * item.quantity,0)
    const {web3, contract, provider} = useWeb3();
    const [priceETH, setPriceETH] = useState(1);
    const [createAccount, setCreateAccount] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState({method: 1});
    const [checkout, setCheckout] = useState((prev) => {
        const examUser = {
            name: "Nguyễn Văn Vấn",
            streetAddress:'144 Huỳnh Văn Nghệ',
            apartmentAddress:'144 Huỳnh Văn Nghệ, Đà Nẵng',
            city:'Đà Nẵng',
            country:'Việt Nam',
            phone:'0362458584',
            email:'van@gmail.com',
            password:'',
            notes:'Giao hàng nhanh nhé!',
            total:subTotal,
            error_list:{},
        }
        let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : examUser;
        user = {...user, error_list:{}};
        return user;
    });
    const { metaMark, setConnectMetaMark } =  useMetaMark();
    console.log(metaMark);
    useEffect(() => {
        const getPriceEth = async ()=>{
            fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=ETH,VND")
            .then(response => response.json())
            .then(data => {
                setPriceETH(data.VND)
            });
        }
        const setBg = document.querySelectorAll('.set-bg');
        setBg.forEach((item) => {
            let bg = item.getAttribute('data-setbg');
            item.style.backgroundImage = `url('${bg}')`;
        })
        let hero__item = document.querySelector(".hero__item");
        hero__item.style.display = 'none';
        let hero__categories = document.querySelector(".hero__categories ul");
        hero__categories.style.display = 'none';
        getPriceEth();
    }, []);
    const priceTotalETH =(subTotal / parseFloat(priceETH)).toFixed(10);
    const handleInput = (e)=> {
        setCheckout({...checkout,[e.target.name]: e.target.value});
    }
    const cart = localStorage.getItem('cart');
    const userPaymentOrder = async (id)=>{
        const amount = web3.utils.toWei(priceTotalETH.toString(), "ether");
        await contract.methods.userPaymentOrder(id).send({
                from:metaMark.wallet,
                value:amount
            })
            .then((_transfer)=>{
                localStorage.removeItem('cart');
                setCartItems([]);
                setCheckout({
                    name:'',
                    streetAddress:'',
                    apartmentAddress:'',
                    city:'',
                    country:'',
                    phone:'',
                    email:'',
                    password:'',
                    notes:'',
                    total:subTotal,
                    error_list:{}
                });
                Notiflix.Loading.remove();
                Notiflix.Notify.success("Order has been paid!");
            })
            .catch((err)=>{
                console.log(err);
            })
        return false;
    }
    const handleAccountsChanged = async () => {
        const accounts = await web3.eth.getAccounts();
        if(accounts.length === 0)
        {
            console.log("No Wallet");
        }else if(accounts[0] !== metaMark.wallet) {
            setConnectMetaMark({wallet: accounts[0], isConnected: true});
        }
    }
    const  handelConnectMetamask = async () => {
        provider.request({ method: 'eth_requestAccounts' })
        .then((accounts)=>{
            setConnectMetaMark({wallet: accounts[0], isConnected: true});
           Notiflix.Loading.remove();
           Notiflix.Notify.warning("Please! Checkout again! ");
        })
        .catch((error) => {
          if (error.code === 4001) {
            Notiflix.Report.failure(`Can't payment`,'Please connect to MetaMask.','Canel');
          } else {
            console.error(error);
          }
        });
        
    }
    const handleSubmit = (e) => {
        Notiflix.Loading.hourglass("Loading data...",{
            clickToClose: true,
            svgSize: '120px',
        });
        e.preventDefault();
        const params = {
            name: checkout.name,
            streetAddress:checkout.streetAddress,
            apartmentAddress:checkout.apartmentAddress,
            city:checkout.city,
            country:checkout.country,
            phone:checkout.phone,
            email:checkout.email,
            notes:checkout.notes,
            cart: cart,
            totalVND:subTotal,
            totalETH:priceTotalETH,
            method:paymentMethod.method,
        }
        console.log(params)
        if(!cart){
            Notiflix.Report.failure(`Can't payment`,'Your shopping cart is empty','Canel');
        }else{

            switch (paymentMethod.method) {
                case 1:
                    handleStoreOrder(params)
                    .then((res) =>{
                        localStorage.removeItem('cart');
                        setCartItems([]);
                        setCheckout({
                            firstName:'',
                            lastName:'',
                            streetAddress:'',
                            apartmentAddress:'',
                            city:'',
                            country:'',
                            phone:'',
                            email:'',
                            password:'',
                            notes:'',
                            total:subTotal,
                            error_list:{}
                        })
                        Notiflix.Notify.success("Order has been saved!");
                    })
                    .catch((error) => {
                        if(error.response.data.listError){
                            setCheckout((prev)=>{
                                return {...prev, error_list: error.response.data.listError}
                            });
                        }
                    });
                    Notiflix.Loading.remove();
                    break;
                case 2:
                    if(metaMark.wallet === '') {
                        handelConnectMetamask();
                    } else {
                        handleStoreOrder(params)
                        .then((res)=>{
                            
                            Notiflix.Notify.success("Order has been saved!");
                            userPaymentOrder(res);
                        })
                        .catch((error) => {
                            if(error.response.data.listError){
                                setCheckout((prev)=>{
                                    return {...prev, error_list: error.response.data.listError}
                                });
                            }
                        });
                    }
                    break;
                default:
                    throw new Error("Invalid payment method");
            }
            if (createAccount) {
                const paramsAcount = {
                    name:checkout.name,
                    streetAddress:checkout.streetAddress,
                    apartmentAddress:checkout.apartmentAddress,
                    city:checkout.city,
                    country:checkout.country,
                    phone:checkout.phone,
                    email:checkout.email,
                    password:checkout.password
                }
                authorizationApi.registerUser(paramsAcount)
                .then((data) =>{
                    console.log(data)
                })
                .catch((err) =>{
                    console.log(err);
                })
            }
        }
    }
    const handleStoreOrder = async (params) =>{
        let orderID;
        await checkoutApi.checkout(params)
        .then((data)=>{
            if(data.success === true)
            {
                orderID =  data.orderID;
            }
        })
        .catch((err)=>{
            throw err;
        })
        return orderID;
    }
    return (
        <div>
            <section className="breadcrumb-section set-bg" data-setbg="Resource/User/image/breadcrumb.jpg">
                <div className="container">
                <div className="row">
                    <div className="col-lg-12 text-center">
                    <div className="breadcrumb__text">
                        <h2>Checkout</h2>
                        <div className="breadcrumb__option">
                        <Link to={`/`}>Home</Link>
                        <span>Checkout</span>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            <section className="checkout spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                        <h6><span className="icon_tag_alt" /> Have a coupon? <a href="#">Click here</a> to enter your code
                        </h6>
                        </div>
                    </div>
                    <div className="checkout__form">
                        <h4>Billing Details</h4>
                        <form action="#" autoComplete='on'>
                        <div className="row">
                            <div className="col-lg-8 col-md-6">
                                <div className="row">
                                    <div className="col-lg-12">
                                    <div className="checkout__input">
                                        <p>Fist Name<span>*</span></p>
                                        <input type="text" name='name' value={checkout.name} onChange={handleInput} />
                                        <span className="text-danger small">{checkout.error_list.name}</span>
                                    </div>
                                    </div>
                                </div>
                            <div className="checkout__input">
                                <p>Address<span>*</span></p>
                                <input type="text" name='streetAddress' value={checkout.streetAddress} onChange={handleInput}  placeholder="Street Address"  className="checkout__input__add" />
                                <span className="text-danger small">{checkout.error_list.streetAddress}</span>
                                <input type="text" name='apartmentAddress' value={checkout.apartmentAddress} onChange={handleInput}  placeholder="Apartment, suite, unite ect (optinal)" />
                                <span className="text-danger small">{checkout.error_list.apartmentAddress}</span>
                            </div>
                            <div className="checkout__input">
                                <p>Town/City<span>*</span></p>
                                <input type="text" name='city' value={checkout.city} onChange={handleInput} />
                                <span className="text-danger small">{checkout.error_list.city}</span>
                            </div>
                            <div className="checkout__input">
                                <p>Country/State<span>*</span></p>
                                <input type="text" name='country' value={checkout.country} onChange={handleInput} />
                                <span className="text-danger small">{checkout.error_list.country}</span>
                            </div>
                            <div className="checkout__input">
                                <p>Postcode / ZIP<span>*</span></p>
                                <input type="text" />
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                <div className="checkout__input">
                                    <p>Phone<span>*</span></p>
                                    <input type="number" name='phone' value={checkout.phone} onChange={handleInput} />
                                    <span className="text-danger small">{checkout.error_list.phone}</span>
                                </div>
                                </div>
                                <div className="col-lg-6">
                                <div className="checkout__input">
                                    <p>Email<span>*</span></p>
                                    <input type="text" name='email' value={checkout.email} onChange={handleInput} />
                                    <span className="text-danger small">{checkout.error_list.email}</span>
                                </div>
                                </div>
                            </div>
                            <div className="checkout__input__checkbox">
                                <label htmlFor="acc">
                                Create an account?
                                <input type="checkbox" id="acc" checked={createAccount} onChange={()=> setCreateAccount(!createAccount)} />
                                <span className="checkmark" />
                                </label>
                            </div>
                            <p>Create an account by entering the information below. If you are a returning customer
                                please login at the top of the page</p>
                            <div className="checkout__input">
                                <p>Account Password<span>*</span></p>
                                <input type="password" name='password' value={checkout.password} onChange={handleInput}/>
                                <span className="text-danger small">{checkout.error_list.password}</span>
                            </div>
                            <div className="checkout__input__checkbox">
                                <label htmlFor="diff-acc">
                                Ship to a different address?
                                <input type="checkbox" id="diff-acc" />
                                <span className="checkmark" />
                                </label>
                            </div>
                            <div className="checkout__input">
                                <p>Order notes<span>*</span></p>
                                <input type="text" name='notes' value={checkout.notes} onChange={handleInput} placeholder="Notes about your order, e.g. special notes for delivery." />
                                <span className="text-danger small">{checkout.error_list.notes}</span>
                            </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                            <div className="checkout__order">
                                <h4>Your Order</h4>
                                <div className="checkout__order__products">Products <span>Total</span></div>
                                <ul>
                                    {
                                        cartItems.map((cart) =>{
                                            return ( <li key={cart._id}>{cart.name}<span>{(cart.price * cart.quantity).toLocaleString('vi-VN', {style: 'currency',currency: 'VND'})}</span></li> )
                                        })
                                    }
                                </ul>
                                <div className="checkout__order__subtotal">Subtotal <span>{subTotal.toLocaleString('vi-VN', {style: 'currency',currency: 'VND'})}</span></div>
                                <div className="checkout__order__total">Total <span>{subTotal.toLocaleString('vi-VN', {style: 'currency',currency: 'VND'})}</span></div>
                                <div className="checkout__input__checkbox">
                                </div>
                                <p>Payment method:</p>
                                <div className="checkout__input__checkbox">
                                <label htmlFor="payment">
                                    Payment on delivery
                                    <input type="radio" id="payment" name="payment"  onClick={()=>setPaymentMethod({method:1})}/>
                                    <span className="checkmark" />
                                </label>
                                </div>
                                <div className="checkout__input__checkbox">
                                <label htmlFor="paypal">
                                    Payment with tokens(ETH)
                                    <input type="radio" id="paypal" name="payment" onClick={()=>setPaymentMethod({method:2})}/>
                                    <span className="checkmark" />
                                </label>
                                </div>
                                <button type="submit" className="site-btn" onClick={handleSubmit}>PLACE ORDER</button>
                            </div>
                            </div>
                        </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CheckOut
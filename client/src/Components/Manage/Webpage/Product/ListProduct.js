import React,{useEffect, useState} from 'react'
import {Link} from "react-router-dom";
import $ from 'jquery'
import Notiflix from 'notiflix';
import productApi from '../../../../Api/productApi';
function ListProduct() {
    const [products,setProducts] = useState([]);
    useEffect(() => {
        const fetchProductlist = async () => {
            await productApi.getAll()
            .then((res)=>{
                if(res.success === true){
                    setProducts(res.products)
                }
                Notiflix.Loading.remove(500);
            })
            .catch((err)=>{
                Notiflix.Report.warning("Get Product failure","Please come back late!" , 'Cancel');
                Notiflix.Loading.remove(500);
            })
        }
        fetchProductlist();
    }, []);
    Notiflix.Loading.hourglass("Loading data...",{
        clickToClose: true,
        svgSize: '120px',
    });
    const handleRemoveProduct = async (id) => {
        const params = {id}
        await productApi.delete(params)
        .then((res)=>{
            if(res.success === true){
                Notiflix.Report.warning("Delete Product Successfully","Product has been remove from database" , 'Cancel');
                document.getElementById(`${id}`).remove();
            } 
        }).catch((error)=>{
            Notiflix.Report.failure("Delete Product Failure",error.response.data.message, 'Cancel');
        })
    }
    return (
        <div className="mx-4">
            <div className="card o-hidden border-0 shadow-lg my-5">
                <div className="card-body p-0">
                    {/* Nested Row within Card Body */}
                    <div className="row">
                        <div className="col-lg-12 table-responsive">
                            <div className="p-5">
                            <div className="text-center">
                                <h1 className="h4 text-gray-900 mb-2">List Category Product</h1>
                            </div>
                            <div className="">
                                <Link to={'/admin/add-product'} className="btn btn-success mb-4">Add Product</Link>
                            </div>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Slug</th>
                                        <th scope="col">Display</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Image</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Quantity</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Type Display</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    products.map((product,index)=>{

                                        let display = '';
                                        let type_display = '';
                                        product.display === 1 ?display = 'show' : display = 'hidden';
                                        switch (product.type_display) {
                                            case 1:
                                                type_display = 'Featured Product'
                                                break;
                                            case 2:
                                                type_display = 'Latest Products'
                                                break;
                                            case 3:
                                                type_display = 'Top Rated Products'
                                                    break;
                                            case 4:
                                                type_display = 'Review Products'
                                                break;
                                            default:
                                                type_display = 'Product No Type Display'
                                                break;
                                        }
                                        return (<tr key={index} id={product._id}>
                                                    <th scope="row">{index+1}</th>
                                                    <td>{product.name}</td>
                                                    <td>{product.slug}</td>
                                                    <td>
                                                        { display}
                                                    </td>
                                                    <td  style={{ maxWidth: 250 }} title={product.desc} >{product.desc}</td>
                                                    <td>
                                                        <img className="img-fluid" src={process.env.REACT_APP_API_URL+`uploads/`+product.image} alt="Product Image" width={'200px'} />
                                                    </td>
                                                    <td>{product.price}</td>
                                                    <td>{product.qty}</td>
                                                    
                                                    <td>{product.category_id.name}</td>
                                                    <td>{ type_display}</td>
                                                    <td>
                                                        <Link to={'/admin/product/'+product._id} className="btn btn-info mr-1 mb-1"><i className="fas fa-edit"></i></Link>
                                                        <button onClick={()=>{handleRemoveProduct(product._id)}} data-id={product._id} className="btn btn-danger remove_cate"><i className="fas fa-trash pr-1"></i></button>
                                                    </td>
                                                </tr>)
                                    })
                                }
                                </tbody>
                            </table>    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListProduct

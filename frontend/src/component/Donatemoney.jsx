import React,{useState} from 'react'
import useRazorpay from "react-razorpay";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { soket } from '../App';
import { useSelector,useDispatch } from 'react-redux';
import { logoutr } from '../feature/authSlice';
const Donatemoney = () => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [Razorpay] = useRazorpay();
    
    // const [data,setdata]=useState(null)
    // const [token,settoken]=useState(()=>localStorage.getItem("refresh_token")?JSON.parse(localStorage.getItem("refresh_token")):null)
    const user=useSelector((state)=>state.user)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    soket.on('userdfb',(uid)=>{
      if(user._id.toString()===uid.toString()){
        console.log('uid match')
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem('user')
        dispatch(logoutr())
        navigate('/login')
      }
    })
    const handleSubmit = (event) => {
        event.preventDefault();
        // You can perform form submission logic here
        const token=JSON.parse(localStorage.getItem('access_token'))
        const headers={
            Authorization: 'Bearer ' + token 
        }
        axios.post('http://localhost:5000/api/order',{amount},{headers}).then((res)=>{
          const options = {
            key: "rzp_test_aSfNVwnDJfDZ92", // Enter the Key ID generated from the Dashboard
            order_id:res.data.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
            handler: function (response) {
        
              console.log(response.razorpay_payment_id,response.razorpay_order_id,response.razorpay_signature)
              const d={
                order_id:response.razorpay_order_id,
                payment_id:response.razorpay_payment_id,
                payment_signeture:response.razorpay_signature
              }
              axios.put('http://localhost:5000/api/order/orderstatus',d,{headers}).then((r)=>{
                soket.emit('tsff','')
                navigate('/paymenthistory')

              })
            },
            prefill: {
              name: "Piyush Garg",
              email: "youremail@example.com",
              contact: "9999999999",
            },
            notes: {
              address: "Razorpay Corporate Office",
            },
            theme: {
              color: "#3399cc",
            },
          };
        
        const rzp1 = new Razorpay(options);
    
        rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
        });
    
        rzp1.open();

        })
        console.log('Form submitted');
        
    };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Payment Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
              <input type="text" id="name" className="form-input w-full" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-gray-700 font-semibold mb-2">Amount</label>
              <input type="number" id="amount" className="form-input w-full" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-gray-700 font-semibold mb-2">Phone Number</label>
              <input type="text" id="phoneNumber" className="form-input w-full" placeholder="Enter phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <div className="mt-6">
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Proceed to Payment</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Donatemoney

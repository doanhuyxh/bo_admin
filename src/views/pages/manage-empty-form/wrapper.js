
import  {useEffect , useState} from "react"
import Partcicle  from "./../../../assets/images/icons/patriciel.png"
export default function Wrapper({ children }) {
 
  return (
    <>
      <div>
        
      <div className="d-none d-lg-block" id="particles-js">
        <img src={Partcicle} alt="test" className="particles-js-canvas-el" />
      </div>
    
     
        {children}

      </div>

    </>
  )
}
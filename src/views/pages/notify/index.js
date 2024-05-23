import React, {useEffect, useState, useRef} from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input} from 'reactstrap';

function Notify() {

    const [data, setData] = useState([])
    const [modal, setModal] = useState(false)
    const [id, setId] = useState(0)
    const [content, setContent] = useState("")
    const [isBuy, setBuy] = useState(false)
    const [isActive, setActive] = useState(false)

    const handleInputContent = (e) => {
        setContent(e.target.value);
    };

    const handleInputBuy = (e) => {
        setBuy(e.target.value);
    };

    const handleInputActive = (e) => {
        setActive(e.target.value);
    };

    function handleDelete(id) {
        fetch(`https://notify.miraehktrading.mom/Notify?id=${id}`, {
            method: "DELETE",
        }).then(res => res.json())
            .then(dat => {
                if (dat.statusCode == 200) {
                    setData(dat.data)
                }
            })
    }

    function HandleUpdate(id) {
        setId(id)

        if(id===0){
            setContent("")
            setBuy(false)
            setActive(false)
        }else{

            let s = data.find(i=>i.id === id);
            console.log("s", s)
            setContent(s.content)
            setBuy(s.isBuy)
            setActive(s.isActive)
        }
        setModal(true)

    }

    function Save(){
        let fomData = new FormData()
        fomData.append("Id", id)
        fomData.append("Content", content)
        fomData.append("isBuy", isBuy)
        fomData.append("IsActive", isActive)
        fomData.append("IsDeleted", false)

        fetch("https://notify.miraehktrading.com/Notify",{
            method:"POST",
            body:fomData
        }).then(res=>res.json())
            .then(dat=>{
                if(dat.statusCode == 200){
                    CallData()
                    setModal(false)
                }
            }).catch(err=>{

            })

    }

    function CallData(){
        fetch("https://notify.miraehktrading.com/Notify/Admin")
            .then(res => res.json())
            .then(dat => {
                if (dat.statusCode == 200) {
                    setData(dat.data)
                }
            }).catch(err=>{
                
            })
    }

    useEffect(() => {
        CallData()
    }, [])

    return (
        <>
            <div className='container'>
                <Button className="btn btn-success" onClick={() => HandleUpdate(0)}>Thêm thông báo</Button>
                <table className="table table-hover-animation">
                    <thead>
                    <tr>
                        <td>STT</td>
                        <td>Nội dung</td>
                        <td>Loại</td>
                        <td>Hoạt động</td>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.content}</td>
                            <td>{item.isActive == true ? "Bật" : "Tắt"}</td>
                            <td>{item.isBuy == true ? "Mua" : "Bán"}</td>
                            <td>
                                <Button type="button" className="waves-effect btn btn-warning btn-sm"
                                        onClick={() => HandleUpdate(item.id)}>Cập nhật
                                </Button>
                                <button type="button" className="waves-effect btn btn-danger btn-sm mx-2"
                                        onClick={() => handleDelete(item.id)}>Xóa
                                </button>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={modal} backdrop={true}>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Input
                                id='Id'
                                name="Id"
                                type='hidden'
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Content" className='form-label-group py-1' style={{fontSize: "1.857rem"}}>
                                Nội dung thông báo
                            </Label>
                            <Input
                                id="Content"
                                name="Content"
                                placeholder="Nội dung thông báo"
                                type="text"
                                value={content}
                                onChange={handleInputContent}

                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="isBuy">
                                Nạp / Rút
                            </Label>
                            <Input
                                id="isBuy"
                                name="isBuy"
                                type="select"
                                value={isBuy}
                                onChange={handleInputBuy}
                            >
                                <option value="true">
                                    Nạp
                                </option>
                                <option value="false">
                                    Rút
                                </option>

                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="isActive">
                                Bật / Tắt
                            </Label>
                            <Input
                                id="isActive"
                                name="isActive"
                                type="select"
                                value={isActive}
                                onChange={handleInputActive}
                            >
                                <option value="true">
                                    Hoạt động
                                </option>
                                <option value="false">
                                    Tắt
                                </option>

                            </Input>
                        </FormGroup>

                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={Save}>
                        Lưu
                    </Button>{' '}
                    <Button color="secondary" onClick={()=>setModal(false)}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default Notify

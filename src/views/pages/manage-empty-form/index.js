// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { toast } from 'react-toastify';
import { MoreVertical, Edit, Lock, Delete, DollarSign, Database, Shield, RefreshCcw } from 'react-feather'
import _ from 'lodash'
import "./index.scss"
import { useForm } from 'react-hook-form'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import Service from '../../../services/request'
import ReactPaginate from 'react-paginate'
import { ChevronDown, } from 'react-feather'
import DataTable from 'react-data-table-component'
import { number_to_price, checkRole } from "./../../../helper/common"
import FileUploaderBasic from '../../forms/form-elements/file-uploader/FileUploaderBasic'
import Wrapper from "./wrapper"
import 'uppy/dist/uppy.css'
import '@uppy/status-bar/dist/style.css'
import '@styles/react/libs/file-uploader/file-uploader.scss'
import {
  Card, Input, Label, Row, Col, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, InputGroup,
  InputGroupButtonDropdown, Modal, ModalHeader, ModalBody,
  Button, FormGroup, Form
} from 'reactstrap'
import moment from 'moment'

const DataTableServerSide = () => {
  // ** Store Vars

  return (
    <Fragment>
  
      <Card  className="accountAdmin">
      <Wrapper>
        <div style={{padding: "20px"}}>
          <Row>
            <Col sm="12" md="7">
            
                  <Form>
                 
                     <FormGroup row>
                       <Label sm='3' for='name'>
                         Trading code
                      </Label>
                        <Col sm='9'>
                          <Input type='text' name='name' id='name' placeholder='' />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                       <Label sm='3' for='name'>
                        Payment methods
                      </Label>
                        <Col sm='9'>
                        <Input
                            type='select'
                            name='tennganhang'      
                          >
                              <option value="Vietcom Bank">Bank</option>
                              
                          </Input>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                       <Label sm='3' for='name'>
                       Bank name
                      </Label>
                        <Col sm='9'>
                        <Input
                            type='select'
                            name='tennganhang'      
                          >  <option value="">Select ...</option>
                              <option value="Vietcom Bank">Vietcom Bank</option>
                              <option value="Exim Bank">Exim Bank</option>
                              <option value="Vietin Bank">Vietin Bank</option>
                              <option value="SacomBank">SacomBank</option>
                              <option value="Vietnam Prosperity Joint-Stock Commercial Bank">Vietnam Prosperity Joint-Stock Commercial Bank</option>
                              <option value="Techcom">Techcom</option>
                              <option value="BIDV Bank">BIDV Bank</option>
                              <option value="MB Bank">MB Bank</option>
                              <option value="KienLong Bank">KienLong Bank</option>
                              <option value="HD Bank">HD Bank</option>
                              <option value="SHB Bank">SHB Bank</option>
                              <option value="SCB Bank">SCB Bank</option>
                              <option value="ACB Bank">ACB Bank</option>
                              <option value="AB Bank">AB Bank</option>
                              <option value="Agri Bank">Agri Bank</option>
                              <option value="Bac A Bank">Bac A Bank</option>
                              <option value="BaoViet Bank">BaoViet Bank</option>
                              <option value="DONGA Bank">DONGA Bank</option>
                              <option value="GP Bank">GP Bank</option>
                              <option value="INDOVINA Bank">INDOVINA Bank</option>
                              <option value="LienViet Post Bank">LienViet Post Bank</option>
                              <option value="Maritime">Maritime</option>
                              <option value="Nam A Bank">Nam A Bank</option>
                              <option value="Navi Bank">Navi Bank</option>
                              <option value="NCB">NCB</option>
                              <option value="OCB (PHUONG DONG)">OCB (PHUONG DONG)</option>
                              <option value="PG Bank">PG Bank</option>
                              <option value="PVCOM Bank">PVCOM Bank</option>
                              <option value="SaiGon Bank">SaiGon Bank</option>
                              <option value="SaA Bank">SaA Bank</option>
                              <option value="ShinHan Bank">ShinHan Bank</option>
                              <option value="Tien Phong Bank">Tien Phong Bank</option>
                              <option value="United Overseas Bank">United Overseas Bank</option>
                              <option value="VIB Bank">VIB Bank</option>
                              <option value="VietABank">VietABank</option>
                              <option value="VPBANK">VPBANK</option>
                          </Input>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                          <Label sm={3} for='socmnd'>Account name</Label>
                          <Col sm='7'>
                            <Input
                              name='socmnd'
                              id='socmnd'
                             
                            />
                          </Col>
                          <Col sm='2'>
                            <Button.Ripple color='primary'>Copy</Button.Ripple>
                           </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label sm={3} for='numberac'>Account number</Label>
                          <Col sm='7'>
                            <Input
                              name='numberac'
                              id='numberac'
                             
                            />
                          </Col>
                          <Col sm='2'>
                            <Button.Ripple color='primary'>Copy</Button.Ripple>
                           </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm={3} for='amount'>Amount</Label>
                          <Col sm='7'>
                            <Input
                              name='amount'
                              id='amount'
                             
                            />
                          </Col>
                          <Col sm='2'>
                            <Button.Ripple color='primary'>Copy</Button.Ripple>
                           </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="3" for='note'>Note</Label>
                          <Col sm='9'>
                          <Input type='textarea'
                             name='Note' 
                             id='note'
                             rows='4' placeholder='' />
                          </Col>
                        </FormGroup>
                     </Form>
                
               </Col>
             
            </Row>
        </div>
        </Wrapper>  
      </Card>

   
    </Fragment >
  )
}

export default memo(DataTableServerSide)

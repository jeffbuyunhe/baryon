import React from 'react'
import GradesInstructor from './GradesInstructor/GradesInstructor'
import GradesStudent from './GradesStudent/GradesStudent'
import {useEffect, useState} from "react"
import { useDispatch, useSelector } from "react-redux"
import { setInstructor } from "../../../reducers/instructorReducer"

const Grades = () => {
  const dispatch = useDispatch()
  const instructor = useSelector(state => state.instructor)
  const [isInstructor, setIsInstructor] = useState(false)

  useEffect(() => {
    if(instructor)
        setIsInstructor(true)
    else
        setInstructor(false)
  }, [dispatch, instructor]);

  if(!isInstructor){
    return <GradesStudent/>
  }
  else{
    return <GradesInstructor/>
  }
}

export default Grades
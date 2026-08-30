import React from 'react';
import { useAuth } from '../../context/AuthContext';
import CoexistenceTeacher from './CoexistenceTeacher';
import CoexistenceStudent from './CoexistenceStudent';

export const ClassroomArena = ({ isTeacher = false }) => {
    const { profile } = useAuth();

    // If explicit isTeacher prop is true or user profile is profesor, render Teacher GM Launchpad
    if (isTeacher) {
        return <CoexistenceTeacher />;
    }

    // Otherwise render Student Player Terminal (strictly role-based, no projector leaks)
    return <CoexistenceStudent profile={profile} />;
};

export default ClassroomArena;

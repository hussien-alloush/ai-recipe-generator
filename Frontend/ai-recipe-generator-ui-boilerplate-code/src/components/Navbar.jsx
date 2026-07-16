import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
    ChefHat,
    Home,
    UtensilsCrossed,
    Calendar,
    ShoppingCart,
    Settings,
    User
} from 'lucide-react';

import { useState, useEffect, useRef } from 'react';


const Navbar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);


    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsDropdownOpen(false);
    };


    // Close dropdown when clicking outside
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }

        };


        document.addEventListener(
            'mousedown',
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );

        };

    }, []);



    return (

        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex justify-between items-center h-16">


                    {/* Logo */}

                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 text-xl font-semibold text-gray-900"
                    >

                        <ChefHat className="w-7 h-7 text-emerald-500" />

                        <span>
                            AI Recipe Generator
                        </span>

                    </Link>




                    {/* Navigation Links */}

                    <div className="hidden md:flex items-center gap-1">


                        <NavLink
                            to="/dashboard"
                            icon={<Home className="w-4 h-4" />}
                            label="Dashboard"
                        />


                        <NavLink
                            to="/pantry"
                            icon={<UtensilsCrossed className="w-4 h-4" />}
                            label="Pantry"
                        />


                        <NavLink
                            to="/generate"
                            icon={<ChefHat className="w-4 h-4" />}
                            label="Generate"
                        />


                        <NavLink
                            to="/recipes"
                            icon={<UtensilsCrossed className="w-4 h-4" />}
                            label="Recipes"
                        />


                        <NavLink
                            to="/meal-plan"
                            icon={<Calendar className="w-4 h-4" />}
                            label="Meal Plan"
                        />


                        <NavLink
                            to="/shopping-list"
                            icon={<ShoppingCart className="w-4 h-4" />}
                            label="Shopping"
                        />

                    </div>





                    {/* User Menu */}

                    <div className="flex items-center gap-3">


                        {/* Settings */}

                        <Link
                            to="/settings"
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >

                            <Settings className="w-5 h-5" />

                        </Link>





                        {/* User Dropdown */}

                        <div
                            className="relative"
                            ref={dropdownRef}
                        >


                            <button

                                onClick={() =>
                                    setIsDropdownOpen(!isDropdownOpen)
                                }

                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"

                            >

                                <User className="w-5 h-5" />

                            </button>





                            {isDropdownOpen && (

                                <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-1 border">


                                    {/* User Information */}

                                    <div className="px-4 py-3 text-sm text-gray-700">

                                        <p className="font-semibold">
                                            {user?.name || "User"}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {user?.email}
                                        </p>

                                    </div>



                                    <hr />



                                    <Link

                                        to="/profile"

                                        onClick={() =>
                                            setIsDropdownOpen(false)
                                        }

                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"

                                    >

                                        Profile

                                    </Link>





                                    <button

                                        onClick={handleLogout}

                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"

                                    >

                                        Logout

                                    </button>


                                </div>

                            )}



                        </div>


                    </div>



                </div>


            </div>


        </nav>

    );

};






// Navigation Link Component

const NavLink = ({ to, icon, label }) => {


    return (

        <Link

            to={to}

            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"

        >

            {icon}

            <span>
                {label}
            </span>


        </Link>

    );

};



export default Navbar;
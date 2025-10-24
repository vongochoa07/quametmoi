import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Menu, X, Bug, Home, List, Info } from 'lucide-react';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #667eea;
  font-size: 24px;
  font-weight: 700;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const LogoIcon = styled(Bug)`
  margin-right: 10px;
  width: 32px;
  height: 32px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    gap: 20px;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8f9fa;
    color: #667eea;
  }
  
  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
`;

const NavIcon = styled.span`
  margin-right: 8px;
  width: 20px;
  height: 20px;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8f9fa;
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const navItems = [
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: '/insects', label: 'Danh sách côn trùng', icon: List },
    { path: '/about', label: 'Giới thiệu', icon: Info },
  ];
  
  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/" onClick={closeMenu}>
          <LogoIcon />
          Pest AI
        </Logo>
        
        <NavLinks isOpen={isMenuOpen}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
                onClick={closeMenu}
              >
                <NavIcon>
                  <Icon size={20} />
                </NavIcon>
                {item.label}
              </NavLink>
            );
          })}
        </NavLinks>
        
        <MobileMenuButton onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </MobileMenuButton>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;

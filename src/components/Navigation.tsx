'use client';
import Image from 'next/image';
import LogoutButton from './LogoutButton';
import styled, { css } from 'styled-components';
import Link from 'next/link';
import { useState } from 'react';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';

const MainNav = styled.nav`
  position: sticky;
  top: 0;
  display: flex;
  height: 4rem;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  padding: 0px 1rem;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 0 15px 1px rgba(0, 0, 0, 0.4);
`;

const HomeLink = styled(Link)`
  svg {
    width: 30px;
    height: 30px;
    filter: invert(100%);
    transition: opacity 0.5s;

    &:hover,
    &:focus {
      opacity: 0.5;
    }
  }
`;

const NavItems = styled.ul`
  list-style-type: none;
  display: flex;
  gap: 2rem;

  @media ${({ theme }) => theme.device.tablet} {
    display: none;
  }
`;

const NavItem = styled.li`
  @media ${({ theme }) => theme.device.tablet} {
    display: none;
  }
`;

const NavText = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
  transition: color 0.25s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const DesktopOnly = styled.div`
  @media ${({ theme }) => theme.device.tablet} {
    display: none;
  }
`;

const HamburgerButton = styled.button<{ $open?: boolean }>`
  all: unset;
  display: none;
  width: 30px;
  height: 30px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  cursor: pointer;

  span {
    display: block;
    position: absolute;
    height: 1px;
    width: 100%;
    background: #fff;
    border-radius: 9px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;

    &:nth-child(1) {
      top: 0px;
    }

    &:nth-child(2),
    &:nth-child(3) {
      top: 10px;
    }

    &:nth-child(4) {
      top: 20px;
    }

    ${({ $open }) =>
      $open &&
      css`
        &:nth-child(1) {
          top: 10px;
          width: 0%;
          left: 50%;
        }

        &:nth-child(2) {
          transform: rotate(45deg);
        }

        &:nth-child(3) {
          transform: rotate(-45deg);
        }

        &:nth-child(4) {
          top: 10px;
          width: 0%;
          left: 50%;
        }
      `};
  }

  @media ${({ theme }) => theme.device.tablet} {
    display: initial;
  }
`;

const MobileNav = styled.div<{ $open?: boolean }>`
  display: none;

  @media ${({ theme }) => theme.device.tablet} {
    display: grid;
    position: fixed;
    width: 100%;
    min-height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.75);
    transform-origin: 0% 0%;
    transform: translate(100%, 0);

    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);

    ${({ $open }) =>
      $open &&
      css`
        transform: translate(0, 0);
      `}
  }
`;

const MobileNavItems = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const MobileNavItem = styled.li``;

export default function Navigation() {
  const [navOpen, setNavOpen] = useState(false);
  useLockBodyScroll(navOpen);
  return (
    <>
      <MainNav>
        <HomeLink href="/search">
          <Image
            alt="fetch logo"
            src={'https://fetch.com/assets/images/logos/calvin.png'}
            width={50}
            height={50}
          />
        </HomeLink>

        <NavItems>
          <NavItem>
            <NavText href="/search">Search</NavText>
          </NavItem>
          <NavItem>
            <NavText href="/favorites">Favorites</NavText>
          </NavItem>
        </NavItems>

        <DesktopOnly>
          <LogoutButton />
        </DesktopOnly>
        <HamburgerButton $open={navOpen} onClick={() => setNavOpen(!navOpen)}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </HamburgerButton>
      </MainNav>

      <MobileNav $open={navOpen}>
        <MobileNavItems>
          <MobileNavItem>
            <NavText href="#about" onClick={() => setNavOpen(!navOpen)}>
              About Me
            </NavText>
          </MobileNavItem>
          <MobileNavItem>
            <NavText href="#projects" onClick={() => setNavOpen(!navOpen)}>
              Projects
            </NavText>
          </MobileNavItem>
          <MobileNavItem>
            <NavText href="#technology" onClick={() => setNavOpen(!navOpen)}>
              Technology
            </NavText>
          </MobileNavItem>
          <MobileNavItem>
            <LogoutButton />
          </MobileNavItem>
        </MobileNavItems>
      </MobileNav>
    </>
  );
}

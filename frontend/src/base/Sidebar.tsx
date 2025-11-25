import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence, Variants } from 'framer-motion'; // Import Framer Motion

// components
import SecondaryButton from '../components/SecondaryButton';
import Accordion from '../components/Accordion';

interface SideBarProps {
    name: string;
}

const sidebarVariants: Variants = {
    open: {
        x: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    },
    closed: {
        x: "-100%",
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
};

const itemVariants: Variants = {
    open: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: {
        opacity: 0,
        x: -20,
        transition: { duration: 0.2 }
    }
};

const SideBar = (props: SideBarProps) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const main = document.getElementsByTagName('main')[0];
        if (main) { 
            if (isOpen) {
                document.body.style.overflow = 'hidden';
                const width = document.documentElement.clientWidth;
                main.style.paddingLeft = width > 994 ? '16rem' : '0';
                main.style.transition = 'padding 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // Curva similar ao spring
            } else {
                document.body.style.overflow = 'unset';
                main.style.marginLeft = '0rem';
                main.style.paddingLeft = '0';
            }
        }
    }, [isOpen]);

    return (
        <>
            <SidepanelDesktop
                initial={false}
                animate={isOpen ? "open" : "closed"}
                variants={sidebarVariants}
            >
                <SidepanelWrapper>
                    <motion.div className="logo" variants={itemVariants}>
                        <h5>Cemitério</h5>
                    </motion.div>

                    <NavigationList>
                        {/* Itens de navegação envolvidos em motion.li para o efeito stagger */}
                        <motion.li variants={itemVariants} className={router.pathname == '/' ? 'active' : ''}>
                            <Link legacyBehavior href="/"><a>Dashboard</a></Link>
                        </motion.li>

                        <motion.li variants={itemVariants} className={router.pathname == '/titulares' ? 'active' : ''}>
                            <Link legacyBehavior href="/titulares"><a>Titulares</a></Link>
                        </motion.li>

                        <motion.li variants={itemVariants} className={router.pathname == '/falecidos' ? 'active' : ''}>
                            <Link legacyBehavior href="/falecidos"><a>Falecidos</a></Link>
                        </motion.li>

                        <motion.li variants={itemVariants} className={router.pathname == '/tumulos' ? 'active' : ''}>
                            <Link legacyBehavior href="/tumulos"><a>Túmulos</a></Link>
                        </motion.li>

                        <motion.div variants={itemVariants} style={{ width: '100%' }}>
                            <li className={router.pathname == '/funcionarios' ? 'active' : ''}>
                                <Link legacyBehavior href="/funcionarios"><a>Funcionários</a></Link>
                            </li>  
                        </motion.div>

                        <motion.li variants={itemVariants} className={router.pathname == '/eventos' ? 'active' : ''}>
                            <Link legacyBehavior href="/eventos"><a>Eventos</a></Link>
                        </motion.li>

                        <motion.li variants={itemVariants} className={router.pathname == '/fornecedores' ? 'active' : ''}>
                            <Link legacyBehavior href="/fornecedores"><a>Fornecedores</a></Link>
                        </motion.li>

                        <motion.li variants={itemVariants} className={router.pathname == '/contratos' ? 'active' : ''}>
                            <Link legacyBehavior href="/contratos"><a>Contratos</a></Link>
                        </motion.li>
                    </NavigationList>
                </SidepanelWrapper>
                
                <motion.div variants={itemVariants}>
                    <SecondaryButton className='user-button'>Sair</SecondaryButton>
                </motion.div>
            </SidepanelDesktop>

            <NavDesktop $isOpen={isOpen}>
                <div className="toggle">
                    <motion.button
                        type='button'
                        onClick={() => setIsOpen(!isOpen)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <motion.div 
                            animate={{ rotate: isOpen ? 0 : 180 }}
                            transition={{ duration: 0.3 }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.7274 2C22.3377 2.58328 21.7326 2 21.7326 2L21.7329 5.33351V21.9944L18.4441 22L2 22L2.0003 18.6667L2.00034 2.00021L5.28906 2.00021L21.7274 2ZM18.4441 4.22241H8.57782V19.7778L19.5401 19.7776V4.2222L18.4441 4.22241Z" fill="white" />
                                <path d="M15.9304 10.5635L14.514 12.0001L15.9304 13.4368L16.7052 14.2221L15.9349 15.0027L15.1551 15.7931L14.3803 15.0079L12.1878 12.7857L11.4127 12.0001L12.1878 11.2146L14.3803 8.99236L15.1553 8.20681L15.9304 8.99236L16.7052 9.7777L15.9336 10.5598L15.9304 10.5635Z" fill="white" />
                            </svg>
                        </motion.div>
                    </motion.button>
                </div>

                <div className="title">
                    <p>{props.name}</p>
                </div>

            </NavDesktop>
        </>
    )
}

export default SideBar;

const NavigationList = styled(motion.ul)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    justify-content: center;
    gap: 1.5rem;
    color: white;

    li {

        a {
            display: block;
            padding: 0.125rem 0.5rem;
            background: linear-gradient(to right, var(--background-neutrals-primary) 50%, var(--background-neutrals-inverse) 50%);
            background-size: 200%;
            background-position-x: 200%;
            transition: all 0.15s ease-out;
            background-repeat: no-repeat;
            white-space: nowrap;
            line-height: 1.5rem;
            font-weight: 400;
            color: var(--content-neutrals-primary);

            &:hover, &:focus-visible {
                color: var(--content-neutrals-inverse);
                background-position-x: 100%;
                padding-left: 1rem;
            }

            &:focus-visible {
                outline: 2px solid var(--brand-primary);
                outline-offset: 2px;
            }
        }
    }

    .active {            
        background: linear-gradient(to right, var(--background-neutrals-inverse)  50%, var(--background-neutrals-inverse) 50%);
        background-size: 250%;
        background-position: right;
        color: var(--content-neutrals-fixed-white);
        
        a {
            font-family: 'At Aero Bold';
            color: var(--content-neutrals-fixed-black);
        }

        &:hover a, a:focus-visible {
            color: var(--content-neutrals-inverse);
        }
    }
`

const SidepanelDesktop = styled(motion.aside)`
    @media screen and (max-width: 994px) {
        display: none;
    }
    position: fixed;
    height: 100%;
    display: flex;
    padding: 1.5rem 1rem;
    justify-content: space-between;
    flex-direction: column;
    left: 0;
    top: 0;
    color: white;
    width: 16rem;
    background-color: var(--background-neutrals-secondary);
    border-right: 1px solid var(--outline-neutrals-secondary);
    z-index: 100; 

`

const SidepanelWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`

const NavDesktop = styled.nav<{ $isOpen: boolean }>`
    @media screen and (max-width: 994px) {
        display: none;
    }

    display: flex;
    position: sticky;
    align-items: center;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
    transition: all 200ms ease-in-out;
    color: white;

    .title {
        padding: 1rem;

        p {
            font: 700 1rem/1.5rem "At Aero Bold";
            color: white;
        }
    }

    .toggle {
        padding: 1rem;
        border-right: 1px solid var(--outline-neutrals-secondary);

        button {
            padding: 0.75rem;
            border: none;
            cursor: pointer;

            background: linear-gradient(to right, var(--background-neutrals-inverse) 50%, transparent 50%);
            background-position: right;
            background-size: 250% 100%;
            transition: 0.15s all ease-out;

            svg path {
                fill: var(--content-neutrals-primary);
            }

            &:hover{
                background-position: left;

                svg path {
                    fill: var(--content-neutrals-inverse);
                }
            }
        }
    }
`
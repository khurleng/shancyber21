"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
export default function Navbar() {
 const [open,setOpen]=useState(false); const path=usePathname();
 const links=[["Home","/"],["Services","/#services"],["Products","/product"],["About us","/#about"],["Journal","/blog"]];
 return <header className="site-header"><nav className="shell nav-bar" aria-label="Main navigation"><Link className="brand" href="/" aria-label="Shan Cyber home"><Image src="/img/SC Logo New.png" alt="Shan Cyber" width={1200} height={1043} className="brand-logo" priority /></Link><div className="desktop-nav">{links.map(([label,href])=><Link key={label} className={path===href?"active":""} href={href}>{label}</Link>)}</div><a className="button button-small nav-contact" href="/#contact">Let’s talk <span>↗</span></a><button className="menu-toggle" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open?"Close menu":"Open menu"}>{open?"✕":"☰"}</button></nav>{open&&<div id="mobile-navigation" className="mobile-nav">{links.map(([label,href])=><Link key={label} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}<a href="/#contact" onClick={()=>setOpen(false)}>Let’s talk ↗</a></div>}</header>;
}

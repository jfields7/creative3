// This file contains the Runge-Kutta integrator needed to solve the trajectory equation.
// Here's the equations we need to solve:
// m*x'' = -c*v*x'
// m*y'' = -m*g - c*v*y',
// where v = sqrt(x'^2 + y'^2).
// We can split this up into four first-order equations in x, vx, y, and vy:
// m*vx' = -c*v*vx
// x' = vx
// m*vy' = -m*g - c*v*vy
// y' = vy

let onesixth = 1.0/6.0;

function rhs(vars,eqs,cnsts){
  "use strict";
  let vxa = vars.vx - cnsts.vw;
  let v = Math.sqrt(vxa*vxa + vars.vy*vars.vy);
  eqs.dvx = -cnsts.c*v*vxa/cnsts.m;
  eqs.dx = vars.vx;
  eqs.dvy = -cnsts.g - cnsts.c*v*vars.vy/cnsts.m;
  eqs.dy = vars.vy;
}

function rk4(vars,cnsts){
  "use strict";
  let h = cnsts.h;
  // First stage
  let u = {
    dvx: 0,
    dx: 0,
    dvy: 0,
    dy: 0,
  };
  rhs(vars,u,cnsts);
  let k1 = {
    svx: h*u.dvx,
    sx: h*u.dx,
    svy: h*u.dvy,
    sy: h*u.dy,
  };

  // Second stage
  let vars2 = {
    vx: vars.vx + 0.5*k1.svx,
    x: vars.x + 0.5*k1.sx,
    vy: vars.vy + 0.5*k1.svy,
    y: vars.y + 0.5*k1.sy,
  };
  rhs(vars2,u,cnsts);
  let k2 = {
    svx: h*u.dvx,
    sx: h*u.dx,
    svy: h*u.dvy,
    sy: h*u.dy,
  };

  // Third stage
  let vars3 = {
    vx: vars.vx + 0.5*k2.svx,
    x: vars.x + 0.5*k2.sx,
    vy: vars.vy + 0.5*k2.svy,
    y: vars.y + 0.5*k2.sy,
  };
  rhs(vars3,u,cnsts);
  let k3 = {
    svx: h*u.dvx,
    sx: h*u.dx,
    svy: h*u.dvy,
    sy: h*u.dy,
  };
  
  // Fourth stage
  let vars4 = {
    vx: vars.vx + k3.svx,
    x: vars.x + k3.sx,
    vy: vars.vy + k3.svy,
    y: vars.y + k3.sy,
  };
  rhs(vars4,u,cnsts);
  let k4 = {
    svx: h*u.dvx,
    sx: h*u.dx,
    svy: h*u.dvy,
    sy: h*u.dy,
  };

  // Final variables
  let varsnew = {
    vx: vars.vx + onesixth*(k1.svx + 2*k2.svx + 2*k3.svx + k4.svx),
    x: vars.x + onesixth*(k1.sx + 2*k2.sx + 2*k3.sx + k4.sx),
    vy: vars.vy + onesixth*(k1.svy + 2*k2.svy + 2*k3.svy + k4.svy),
    y: vars.y + onesixth*(k1.sy + 2*k2.sy + 2*k3.sy + k4.sy),
  }

  return varsnew;
}

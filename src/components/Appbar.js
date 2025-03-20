import React from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import logo from '../assets/finance_logo.png'; // Imported logo

function Appbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Budget', path: '/Budget-Management' },
    { name: 'Expenses', path: '/Expense-Tracking-and-Recording' },
    { name: '2-Item Analysis', path: '/Spending-Analysis-(2-Items)' },
    { name: 'Multi-Item Analysis', path: '/Spending-Analysis-(Multiple-Items)' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {navItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path} 
              onClick={handleDrawerToggle} // Close drawer on click
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ bgcolor: '#ffffff', color: '#343434' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img 
              src={logo} 
              alt="Logo" 
              style={{ height: '80px', marginRight: '10px' }} 
            />
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item, index) => (
              <Button 
                key={index} 
                component={Link} 
                to={item.path} 
                color="inherit"
                sx={{ fontWeight: 400, fontSize: 14, mx: 1 }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'block', md: 'none' } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default Appbar;
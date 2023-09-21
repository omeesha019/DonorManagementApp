module.exports = {
    
    name: 'DonorManagement',
    publisher: 'Ellucian',
    cards: [
        {
            type: 'Donor Management',
            source: './src/cards/DonorManagement',
            title: 'Donor Management',
            displayCardType: 'Donor Management System',
            description: 'card for Donor Management System',
            pageRoute: {
                route: '/',
                excludeClickSelectors: ['a']
            }
        }
    ],
    page: {
        source: './src/page/router.tsx',
        fullWidth: true
    }
};

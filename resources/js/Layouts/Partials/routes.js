import {
    HiChartPie,
    HiUser,
    HiUsers,
    HiUserGroup,
    HiUserCircle,
    HiGift,
    HiClipboardCheck,
} from 'react-icons/hi'

export default [
    {
        name: 'Dashboard',
        show: true,
        icon: HiChartPie,
        route: route('dashboard'),
        active: 'dashboard',
        permission: 'view-dashboard',
    },
    {
        name: 'Master Data Peserta',
        show: true,
        icon: HiUserCircle,
        items: [
            {
                name: 'Import',
                show: true,
                icon: null,
                route: route('participant.import'),
                active: 'participant.import',
                permission: 'create-participant',
            },
            {
                name: 'Peserta',
                show: true,
                icon: null,
                route: route('participant.index'),
                active: 'participant.index',
                permission: 'view-participant',
            },
        ],
    },
    {
        name: 'Master Data Reward',
        show: true,
        icon: HiClipboardCheck,
        items: [
            {
                name: 'Event',
                show: true,
                icon: null,
                route: route('event.index'),
                active: 'event.*',
                permission: 'view-event',
            },
            {
                name: 'Hadiah',
                show: true,
                icon: null,
                route: route('gift.index'),
                active: 'gift.*',
                permission: 'view-gift',
            },
        ],
    },
    {
        name: 'Data Drawing',
        show: true,
        icon: HiGift,
        route: route('draw.index'),
        active: 'draw.index',
        permission: 'view-draw',
    },
    {
        name: 'User',
        show: true,
        icon: HiUser,
        items: [
            {
                name: 'Roles',
                show: true,
                icon: HiUserGroup,
                route: route('roles.index'),
                active: 'roles.*',
                permission: 'view-role',
            },
            {
                name: 'Users',
                show: true,
                icon: HiUsers,
                route: route('user.index'),
                active: 'user.index',
                permission: 'view-user',
            },
        ],
    },
    {
        name: 'Setting',
        show: true,
        icon: HiChartPie,
        route: route('setting.index'),
        active: 'setting.index',
        permission: 'view-setting',
    },
]

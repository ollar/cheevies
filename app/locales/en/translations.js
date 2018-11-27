export default {
    or: 'or',

    login: {
        buttons: {
            submit: 'Sign in',
            register: 'Sign up',
        },
        title: 'Login',
        messages: {
            no_such_group:
                "Can't find a group. Please check typing and try again. Group name is case sensitive.",
            group_is_locked:
                'This group is private. You can ask member to send you invitation link.',
        },
    },

    register: {
        buttons: {
            login: 'Sign in',
            submit: 'Sign up',
        },
        title: 'Register',
        success_message: 'Welcome aboard',
    },

    form: {
        name: {
            label: 'Name',
            placeholder: 'Type your name here',
        },
        email: {
            label: 'Email',
            placeholder: 'Type your email here',
        },
        password: {
            label: 'Password',
            placeholder: 'Type your password here',
        },
        group: {
            label: 'Group',
            placeholder: 'Type your group here',
        },
    },
    messages: {
        welcome_default: 'Welcome back!',
        welcome_google: 'Yep, sending data to ANB',
        welcome_github: 'All your repos belongs to us!',
        delete_cheevie_check: 'Are you sure?',
        app_init_error:
            "Oops, seems we failed to launch. That's definitely Henry's fault. Please try again",
        group_already_exist: 'Such group already exist. Please find another name',
    },

    buttons: {
        submit: 'Submit',
        cancel: 'Cancel',
        back: 'Back',
        edit: 'Edit',
        sign_out: 'Sign out',
        delete: 'Delete',
        save: 'Save',
    },

    'create-cheevie': {
        title: 'Create cheevie',
        subtitle: 'Feel free to express your best imagination',
        form: {
            name: {
                label: 'Cheevie name',
                placeholder: 'Add cheevie name here',
            },
            description: {
                label: 'Cheevie description',
                placeholder: 'Add cheevie description here',
            },
            power: {
                label: 'Select cheevie power',
                low: 'low',
                normal: 'norm',
                high: 'high',
            },
        },
    },

    profile: {
        buttons: {
            'give-cheevie': 'Present a cheevie',
        },
        links: {
            refuse_gift: 'Refuse',
        },
    },

    settings: {
        title: 'Settings',
        subtitle: {
            general: 'General',
            'group-settings': 'Group Settings',
        },
        form: {
            pushNotifications: {
                label: 'Push notifications',
            },
            sounds: {
                label: 'Sounds',
            },
            animations: {
                label: 'Animations',
            },
            standaloneApp: {
                label: 'Install App on Homescreen',
            },

            locked: {
                label: 'Locked',
            },

            reloadApp: {
                text: 'Reload App',
            },

            name: {
                label: 'Group name',
                placeholder: 'Type group name',
            },

            code: {
                label: 'Invitation code',
                placeholder: 'Type group invitation code',
            },
        },

        feedback: {
            subject: 'Feedback to Cheevies App',
            linkText: 'Send a feedback',
        },

        group: {
            invitation: {
                title: 'Invitation to Cheevie App group',
                text: '{{sender}} asks you to join the {{group}} group',
                success: 'Invitation sent',
                error: 'Post office is closed, sorry',
            },
        },
    },

    activity: {
        title: 'Current Activity',
        empty: 'No New Activity',
        actions: {
            giveCheevie: 'gave cheevie',
            createCheevie: 'created cheevie',
            updateCheevie: 'updated cheevie',
            refuseCheevie: 'refused cheevie',
            logged: 'logged in',
            registered: 'signed up, hooray!',
        },
    },

    nav: {
        home: 'Home',
        profile: 'Profile',
        'forgot-password': 'Reset Password',
        'create-group': 'Create Group',
    },

    'reset-password': {
        success_message: 'Recovery message sent, keep calm and wait for help',
        error_message: 'Bad weather, resque squad failed to launch',
    },

    index: {
        'create-cheevie': {
            linkText: 'Create new cheevie',
        },
        'new-cheevies': {
            title: "Hooray! You've got new cheevies!",
        },
    },

    'no-cheevies-placeholder': 'There are no cheevies yet, maybe you can create one?',
    'you-have-no-cheevies-yet': 'You have no cheevies yet, but you are the best!',

    footer_message: 'Made with ♥ 2017',

    share: {
        cheevie: {
            title: 'Cheevie App',
            text: 'I have "{{cheevie}}" cheevie in my collection!',
        },

        messages: {
            success: 'Successfully shared',
            error: 'Failed to share',
        },
    },

    create_group: {
        success_message: 'Congratulations! Group created successfully.',
        error_message: 'Oops, error. Group seems to lose its way.',
    },

    'join-group': {
        messages: {
            'attempt-signin': 'Please introduce yourself to join the group.',
            broken_link: 'Oops, seems your invitation link is invalid',
            access_code_wrong: 'Dah, access code is broken',
            success: 'Welcome, to {{groupName}} group, {{username}}!',
        },
    },
};

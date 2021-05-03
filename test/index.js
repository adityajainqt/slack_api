const chai = require('chai');
const expect = chai.expect;

const helper = require('./../src/helper');
const inquirer = require('inquirer')

describe('inquirer.prompt helpers', () => {

    let backup;
    before(() => {
        backup = inquirer.prompt;
        inquirer.prompt = (questions) => Promise.resolve('Y');
    });

    it('asktoSendMessage return a value', async () => {

        let answers = await helper.asktoSendMessage();
        expect(answers).to.be.a('string');
        expect(answers).to.equal('Y');
    });

    it('askToSelectUser return a value', async () => {

        const users = [
            { id: '111', name: 'foo' },
            { id: '222', name: 'bar' },
            { id: '333', name: 'foobar' }
        ];
          
        let answers = await helper.askToSelectUser(users);
        expect(answers).to.be.a('string');
        expect(answers).to.equal('Y');
    });

    after(() => {
        inquirer.prompt = backup;
    });
});

describe('Slack API helpers', () => {

    it('fetchUserList returns a value', async () => {

        let response = await helper.fetchUserList();
        expect(response).to.be.a('object');
    });

    it('sendMessage returns a value', async () => {

        const sendUserDetails = { id: 'U020NLZG4PM', name: 'adityajain' };
        const answer = { select_user: 'adityajain', message: 'test' };

        let response = await helper.sendMessage(sendUserDetails, answer);
        expect(response).to.be.a('object');
    });
});

const IPFS = require('ipfs');
const PeerId = require('peer-id');
const all = require('it-all');
const uint8ArrayConcat = require('uint8arrays/concat');
const uint8ArrayFromString = require('uint8arrays/from-string');
const fs = require('fs');
const Protector  = require('libp2p/src/pnet');

const BOOTSTRAP_ADDRESS_1 =
    "/ip4/bootstrap-server-ip-1/tcp/4001/ipfs/12D3KooWHcQJrUAHAt3XSGzEoedRbdmf2S4Y4aX39EqR8wAExTDb";

const BOOTSTRAP_ADDRESS_2 =
    "/ip4/bootstrap-server-ip-2/tcp/4001/ipfs/12D3KooWLe8sbS7M4mPuWeF2v8h9qyR7qjMeTuiPgYi51AGFQNdS";


const BOOTSTRAP_ADDRESS_3 =
    "/ip4/bootstrap-server-ip-3/tcp/4001/ipfs/12D3KooWMLsqXp8j3Q4eFqfQh1cEVFrmrkKdtcd3JVRaZ2wq94ok";


async function main () {
    try {
        const privateKey = await PeerId.create({ keyType: 'ed25519' });

        // console.log('privateKey: ', privateKey)
        const node = await IPFS.create({
            libp2p: {
                modules: {
                    connProtector: new Protector(fs.readFileSync('./swarm.key')),
                },
            },
            config: {
                Bootstrap: [BOOTSTRAP_ADDRESS_1, BOOTSTRAP_ADDRESS_2, BOOTSTRAP_ADDRESS_3],
            },
            // init: { privateKey }
        });


        node.libp2p.connectionManager.on('peer:connect', (peerId) => {
            console.log('>>');
            console.info('peer:connect', peerId.remotePeer.toB58String())
        });

        node.libp2p.connectionManager.on('peer:disconnect', (peerId) => {
            console.log('<<');
            console.info('peer:disconnect', peerId.remotePeer.toB58String())
        });
        // const boot_id = await node.bootstrap.clear();
        // console.log('boot_id: ', boot_id);

        const boot = await node.bootstrap.list();
        console.log('bootstrap: ', boot);
        // const version = await node.version();
        // console.log('Version:', version.version);
        const id = await node.id();
        console.log('node-id:', id);

        // let swarm = await node.swarm.peers();
        // console.log('1 swarm: ', swarm);


        setInterval(async function () {
            let swarm = await node.swarm.peers();
            console.log('time swarm: ', swarm);

            // if(swarm) {
                // const data = uint8ArrayConcat(await all(node.cat('QmeZqaDsXXaVEPScYjRGaB5TA6dPmRRR3LDFrf2Jq4xCL6')));
                const data = uint8ArrayConcat(await all(node.cat('QmWJc6T1oKxwkmxj9KSs6N9JT7AqDYURoL2ZekF1tmJf7p')));

                console.log('Added file contents:', data)
            // }

            // const cid = await node.pin.add('QmQpeJyAq72DyQFtcBrMuN7s3AdJVvrgpjuLuBjfmMiJE3');
            // console.log("cid: ", cid)
            // Logs:
            // CID('QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy47CnJDgvs8u')
        },5000);



        // const file = await node.add({
        //     path: '1qalesan.txt',
        //     content: uint8ArrayFromString('>>> 1Hello conunchilar!!!!')
        // })
        //
        // console.log('Added file:', file.path, file.cid.toString());




    } catch (e) {
        console.log('connection: ', e);
    }
}


main().then();



// 12D3KooWStc6Ak2dSsVoxecTm63U5PgGQxMqJmTgLzPagPp4ijgj

// 12D3KooWStc6Ak2dSsVoxecTm63U5PgGQxMqJmTgLzPagPp4ijgj

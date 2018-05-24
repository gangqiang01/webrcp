#!/bin/bash 
echo "Waiting for startup.."
until mongo --host ${MONGO1}:${PORT1} --eval 'quit(db.runCommand({ ping: 1 }).ok ? 0 : 2)' &>/dev/null; do
  printf '.'
  sleep 1
done

echo "Started.."

echo setup.sh time now: `date +"%T" `
mongo --host ${MONGO1}:${PORT1} <<EOF
   var cfg = {
        "_id": "${RS}",
        "members": [
            {
                "_id": 0,
                "host": "${MONGO1}:${PORT1}",
                "priority": 1
            },
            {
                "_id": 1,
                "host": "${MONGO2}:${PORT2}",
                "priority": 2
            },
            {
                "_id": 2,
                "host": "${MONGO3}:${PORT3}",
                "priority": 1
            }
        ]
    };
    rs.initiate(cfg, { force: true });
    rs.reconfig(cfg, { force: true });
EOF
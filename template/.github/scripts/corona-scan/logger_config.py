"""
        @Author: ftasha
        @email: ftasha@cisco.com
"""
import logging

from logging.handlers import RotatingFileHandler

import coloredlogs

import config


class MyLogger(object):
    def __init__(self, name, debug) -> None:
        self.debug = debug
        self.name = name

    def get_logger(self):
        # logging.basiçcConfig(format='%(asctime)s,%(msecs)d %(levelname)-8s [%(filename)s:%(lineno)d] %(message)s',
        # datefmt='%Y-%m-%d:%H:%M:%S',
        # level=logging.DEBUG)
        logger = logging.getLogger(self.name)
        # add a rotating handler
        fh = RotatingFileHandler(
            f"{config.home}/log/logs", maxBytes=1000000, backupCount=5
        )
        formatter = logging.Formatter(
            "%(asctime)s - [%(levelname)s]: %(name)s :%(lineno)d %(message)s"
        )
        fh.setLevel(logging.INFO)
        fh.setFormatter(formatter)
        logger.addHandler(fh)
        coloredlogs.install(logger=logger, datefmt="%Y-%m-%d:%H:%M:%S")
        return logger

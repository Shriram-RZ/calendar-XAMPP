<?php

class BSTNode {
    public $event;
    public $left;
    public $right;

    public function __construct($event) {
        if (!$this->isValidEvent($event)) {
            throw new InvalidArgumentException('Invalid event data.');
        }
        $this->event = $event;
        $this->left = null;
        $this->right = null;
    }

    private function isValidEvent($event) {
        return isset($event['start_date']) && strtotime($event['start_date']) !== false;
    }
}

class BinarySearchTree {
    private $root;

    public function __construct() {
        $this->root = null;
    }

    public function insert($event) {
        $newNode = new BSTNode($event);
        if ($this->root === null) {
            $this->root = $newNode;
        } else {
            $this->insertNode($this->root, $newNode);
        }
    }

    private function insertNode($node, $newNode) {
        $newNodeDate = $this->getDateTimestamp($newNode->event['start_date']);
        $nodeDate = $this->getDateTimestamp($node->event['start_date']);

        if ($newNodeDate < $nodeDate) {
            if ($node->left === null) {
                $node->left = $newNode;
            } else {
                $this->insertNode($node->left, $newNode);
            }
        } else {
            if ($node->right === null) {
                $node->right = $newNode;
            } else {
                $this->insertNode($node->right, $newNode);
            }
        }
    }

    private function getDateTimestamp($dateString) {
        return strtotime($dateString);
    }

    public function search($startDate) {
        $timestamp = $this->getDateTimestamp($startDate);
        return $this->searchNode($this->root, $timestamp);
    }

    private function searchNode($node, $startDate) {
        if ($node === null) {
            return null;
        }

        $nodeDate = $this->getDateTimestamp($node->event['start_date']);
        if ($startDate === $nodeDate) {
            return $node->event;
        } elseif ($startDate < $nodeDate) {
            return $this->searchNode($node->left, $startDate);
        } else {
            return $this->searchNode($node->right, $startDate);
        }
    }

    public function searchEvents($startDate, $endDate) {
        $results = [];
        $startTimestamp = $this->getDateTimestamp($startDate);
        $endTimestamp = $this->getDateTimestamp($endDate);
        $this->searchRange($this->root, $startTimestamp, $endTimestamp, $results);
        return $results;
    }

    private function searchRange($node, $startDate, $endDate, &$results) {
        if ($node === null) {
            return;
        }

        $nodeDate = $this->getDateTimestamp($node->event['start_date']);
        if ($nodeDate >= $startDate && $nodeDate <= $endDate) {
            $results[] = $node->event;
        }

        if ($startDate < $nodeDate) {
            $this->searchRange($node->left, $startDate, $endDate, $results);
        }

        if ($endDate > $nodeDate) {
            $this->searchRange($node->right, $startDate, $endDate, $results);
        }
    }
}
?>

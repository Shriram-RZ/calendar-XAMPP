<?php
class BSTNode {
    public $event;
    public $left;
    public $right;

    public function __construct($event) {
        $this->event = $event;
        $this->left = null;
        $this->right = null;
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
        if (strtotime($newNode->event['start_date']) < strtotime($node->event['start_date'])) {
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

    public function search($startDate) {
        return $this->searchNode($this->root, strtotime($startDate));
    }

    private function searchNode($node, $startDate) {
        if ($node === null) {
            return null;
        }

        $nodeDate = strtotime($node->event['start_date']);
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
        $this->searchRange($this->root, strtotime($startDate), strtotime($endDate), $results);
        return $results;
    }

    private function searchRange($node, $startDate, $endDate, &$results) {
        if ($node === null) {
            return;
        }

        $nodeDate = strtotime($node->event['start_date']);
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
    